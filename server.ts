import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { UNIVERSITIES, PROGRAMS, getEnrichedPrograms } from './src/data/universityData';
import { AdvisorInput, AdvisorResponse } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'UniPath Pakistan API' });
  });

  // Get universities
  app.get('/api/universities', (req, res) => {
    res.json(UNIVERSITIES);
  });

  // Get programs with university data
  app.get('/api/programs', (req, res) => {
    const enriched = getEnrichedPrograms();
    res.json(enriched);
  });

  // AI Program Advisor endpoint
  app.post('/api/advisor', async (req, res) => {
    try {
      const input: AdvisorInput = req.body;
      const enrichedPrograms = getEnrichedPrograms();

      // Check if GEMINI_API_KEY is available
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Fallback rule: algorithmic matching if key isn't provided
        const fallbackResponse = generateLocalAdvisorRecommendation(input, enrichedPrograms);
        return res.json(fallbackResponse);
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const userInterests = (input.interests || '').toLowerCase().trim();
      const isExplicitMaster = input.degreeLevel === 'Master' || /\b(ms|master|masters|mphil|m\.phil|mph|msph|msc|mba)\b/i.test(userInterests);
      const isExplicitBachelor = input.degreeLevel === 'Bachelor' || (input.degreeLevel !== 'Master' && /\b(bs|bachelor|bachelors|bsph|bsc|bba|mbbs|dpt|bds|pharm-d)\b/i.test(userInterests));

      const targetDegreeLevel = isExplicitMaster ? 'Master' : isExplicitBachelor ? 'Bachelor' : input.degreeLevel;

      // Filter catalog to strictly match target degree level if requested
      let filteredPrograms = enrichedPrograms;
      if (targetDegreeLevel === 'Master') {
        const mastersOnly = enrichedPrograms.filter((p) => p.degreeLevel === 'Master');
        if (mastersOnly.length > 0) {
          filteredPrograms = mastersOnly;
        }
      } else if (targetDegreeLevel === 'Bachelor') {
        const bachelorsOnly = enrichedPrograms.filter((p) => p.degreeLevel === 'Bachelor');
        if (bachelorsOnly.length > 0) {
          filteredPrograms = bachelorsOnly;
        }
      }

      // Strict Specific Subject / Field Query Filtering
      const queryMatch = getMatchingProgramsForQuery(userInterests, filteredPrograms);
      if (queryMatch.isSpecific && queryMatch.matches.length > 0) {
        filteredPrograms = queryMatch.matches;
      }

      const systemInstruction = `You are an expert Pakistani University Admissions Advisor.
Your highest priority is to provide DIRECT, SPECIFIC, ACCURATE, and HIGHLY DETAILED advice for Pakistani students.

CRITICAL ADVISOR MANDATES:

1. STRICT RELEVANCE & SPECIFICITY MANDATE (ZERO UNRELATED NOISE):
   - When the student asks about a specific program, subject, or field (e.g., "Public Health", "BS Radiology", "DPT", "Computer Science", "MBBS", "Pharm-D"):
     * You MUST ONLY recommend programs directly matching that requested subject/field.
     * You are STRICTLY FORBIDDEN from including unrelated general programs (e.g., do NOT suggest Computer Science or Business if the user asked for Public Health).
     * If the provided catalog contains only 1 or 2 programs matching the requested subject, return ONLY those matching programs. Do NOT pad the response with unrelated general programs.

2. STRICT DEGREE LEVEL MATCHING MANDATE:
   - You MUST strictly filter and recommend ONLY programs that match the requested degree level ("Master" vs "Bachelor").
   - IF THE TARGET DEGREE LEVEL IS "Master" OR THE QUERY MENTIONS A MASTER'S DEGREE (e.g. "MS", "MSPH", "MPhil", "Master", "MPH", "MBA", "MSc"):
     * You MUST ONLY match and return programs where degreeLevel is "Master".
     * You are STRICTLY FORBIDDEN from recommending "Bachelor" or "BS" programs when a Master's degree is requested.
   - IF THE TARGET DEGREE LEVEL IS "Bachelor" OR THE QUERY MENTIONS A BACHELOR'S DEGREE (e.g. "BS", "BSPH", "Bachelor", "MBBS", "DPT", "BBA"):
     * You MUST ONLY match and return programs where degreeLevel is "Bachelor".

3. EXCLUSIVE DATA SOURCE BOUNDARY:
   - You MUST process the provided "Available University Programs Catalog" JSON list as your SINGLE AND EXCLUSIVE source of truth.
   - Do NOT invent, assume, or hallucinate any universities, programs, fees, or requirements outside of the provided catalog array.
   - You must ONLY select program IDs that exist in the provided catalog list.

4. TARGETED SPECIFICITY:
   - Place the exact requested program FIRST in recommendations with a high matchScore (90-100).
   - Provide a specific 2-3 sentence analysis detailing:
     * Exact eligibility check: Compare their marks (${input.marksPercentage}%) against the program's required minimum percentage.
     * Exact required entrance test: Name the test (e.g. GAT General / Departmental Entry Test for MS, or NUST NET / MDCAT / NTS NAT for BS).
     * Exact fee breakdown: Compare semester fee against their budget.
     * Specific career outlook in Pakistan.`;

      const programCatalogContext = filteredPrograms.map((p) => ({
        id: p.id,
        programName: p.name,
        universityName: p.university.name,
        universityShortName: p.university.shortName,
        province: p.university.province,
        sector: p.university.sector,
        degreeLevel: p.degreeLevel,
        feePerSemesterPKR: p.feePerSemester,
        totalFeePKR: p.totalFee,
        minPercentageRequired: p.minPercentageRequired,
        eligibilityCriteria: p.eligibilityCriteria,
        admissionTestRequired: p.admissionTestRequired,
        careerOutlook: p.careerOutlookSummary,
        commonPublicJobs: p.commonPublicJobs,
      }));

      const userPrompt = `Student Profile & Query:
- Marks Percentage: ${input.marksPercentage}%
- Monthly Fee Budget: PKR ${input.monthlyBudget.toLocaleString()} (approx PKR ${(input.monthlyBudget * 6).toLocaleString()} per semester budget)
- Preferred Region: ${input.preferredProvince}
- Target Degree Level: ${targetDegreeLevel}
- Stated Query / Program of Interest: "${input.interests}"

Available University Programs Catalog (Filtered exclusively for ${targetDegreeLevel} degree level):
${JSON.stringify(programCatalogContext, null, 2)}

Instructions:
Select and analyze programs ONLY from the provided catalog above. Ensure ALL recommendations strictly match the target degree level (${targetDegreeLevel}). Do NOT recommend any program outside this catalog.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                programId: {
                  type: Type.STRING,
                  description: 'Exact program ID matching one from the provided list',
                },
                matchScore: {
                  type: Type.INTEGER,
                  description: 'Percentage fit from 0 to 100',
                },
                fitReason: {
                  type: Type.STRING,
                  description: '1-2 sentence explanation connecting student interests, budget, and location.',
                },
                marksWarning: {
                  type: Type.STRING,
                  description: 'Explicit warning if marks % is below min percentage required, otherwise empty string.',
                },
                feeFitNote: {
                  type: Type.STRING,
                  description: 'Note on fee compatibility with the user monthly budget.',
                },
              },
              required: ['programId', 'matchScore', 'fitReason', 'feeFitNote'],
            },
          },
          generalAdvice: {
            type: Type.STRING,
            description: 'Brief encouraging admission guidance and next steps for the Pakistani student.',
          },
        },
        required: ['recommendations', 'generalAdvice'],
      };

      // Models to try in order (using gemini-3.1-pro-preview with high thinking mode)
      const modelsToTry = ['gemini-3.1-pro-preview', 'gemini-3.6-flash', 'gemini-2.5-flash'];
      let responseText = '';

      for (const modelName of modelsToTry) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            if (attempt > 0) {
              await new Promise((resolve) => setTimeout(resolve, 800));
            }
            const isGemini3 = modelName.startsWith('gemini-3');
            const resCall = await ai.models.generateContent({
              model: modelName,
              contents: userPrompt,
              config: {
                systemInstruction,
                thinkingConfig: isGemini3 ? { thinkingLevel: ThinkingLevel.HIGH } : undefined,
                responseMimeType: 'application/json',
                responseSchema,
              },
            });
            if (resCall.text) {
              responseText = resCall.text;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Gemini advisor [${modelName}] attempt ${attempt + 1} issue:`, modelErr?.message || modelErr);
          }
        }
        if (responseText) break;
      }

      if (!responseText) {
        throw new Error('Gemini API temporary unavailability across models');
      }

      const parsedData = JSON.parse(responseText);

      return res.json({
        recommendations: parsedData.recommendations || [],
        generalAdvice: parsedData.generalAdvice || 'Focus on entrance test preparation to improve admission prospects.',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.log('Gemini Advisor notice (using algorithmic matching engine):', err?.message || err);
      // Fallback if API call fails
      const fallback = generateLocalAdvisorRecommendation(req.body, getEnrichedPrograms());
      return res.json(fallback);
    }
  });

  // Vite or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniPath Pakistan server running on http://0.0.0.0:${PORT}`);
  });
}

function getMatchingProgramsForQuery(
  userInterests: string,
  programs: ReturnType<typeof getEnrichedPrograms>
): { isSpecific: boolean; matches: ReturnType<typeof getEnrichedPrograms> } {
  const query = (userInterests || '').toLowerCase().trim();
  if (!query || query.length < 2) {
    return { isSpecific: false, matches: programs };
  }

  const isDpt = query.includes('dpt') || query.includes('physical therapy') || query.includes('physio');
  const isRadiology = query.includes('radiology') || query.includes('radiography') || query.includes('imaging') || query.includes('mit') || query.includes('x-ray') || query.includes('ultrasound');
  const isSurgical = query.includes('surgical') || query.includes('surgery') || query.includes('operation') || query.includes('theater') || query.includes('ott') || query.includes('ot');
  const isMlt = query.includes('mlt') || query.includes('lab') || query.includes('laboratory') || query.includes('pathology');
  const isPublicHealth = query.includes('public health') || query.includes('bsph') || query.includes('msph') || query.includes('mph') || query.includes('epidemiology');
  const isAnesthesia = query.includes('anesthesia') || query.includes('anaesthesia');
  const isNutrition = query.includes('nutrition') || query.includes('dietetics') || query.includes('hnd') || query.includes('dietitian');
  const isOptometry = query.includes('optometry') || query.includes('vision') || query.includes('eye');
  const isCardiac = query.includes('cardiac') || query.includes('cardiovascular') || query.includes('perfusion') || query.includes('cardiology');
  const isDental = query.includes('dental') || query.includes('bds') || query.includes('teeth') || query.includes('oral');
  const isPharm = query.includes('pharm') || query.includes('pharmacy');
  const isMedical = query.includes('mbbs') || query.includes('bds') || query.includes('doctor') || query.includes('medical');
  const isNursing = query.includes('nursing') || query.includes('bsn');
  const isLaw = query.includes('llb') || query.includes('law') || query.includes('legal');
  const isCs = query.includes('cs') || query.includes('computer') || query.includes('software') || query.includes('ai') || query.includes('data science') || query.includes('cyber') || query.includes('it');
  const isBusiness = query.includes('bba') || query.includes('mba') || query.includes('business') || query.includes('finance') || query.includes('accounting') || query.includes('marketing');
  const isEngineering = query.includes('engineering') || query.includes('electrical') || query.includes('civil') || query.includes('mechanical') || query.includes('mechatronics') || query.includes('chemical');
  const isBio = query.includes('bio') || query.includes('biotechnology') || query.includes('microbiology') || query.includes('biochemistry') || query.includes('biosciences');

  const hasSubjectSignal = isDpt || isRadiology || isSurgical || isMlt || isPublicHealth || isAnesthesia || isNutrition || isOptometry || isCardiac || isDental || isPharm || isMedical || isNursing || isLaw || isCs || isBusiness || isEngineering || isBio;

  const matches = programs.filter((prog) => {
    const pName = prog.name.toLowerCase();
    const uName = prog.university.name.toLowerCase();
    const uShort = prog.university.shortName.toLowerCase();
    const cat = prog.category.toLowerCase();

    if (isDpt && (pName.includes('physical therapy') || pName.includes('dpt'))) return true;
    if (isRadiology && (pName.includes('radiology') || pName.includes('imaging') || pName.includes('radiologic'))) return true;
    if (isSurgical && (pName.includes('surgical') || pName.includes('operation theater'))) return true;
    if (isMlt && (pName.includes('lab') || pName.includes('mlt'))) return true;
    if (isPublicHealth && (pName.includes('public health') || pName.includes('bsph') || pName.includes('msph'))) return true;
    if (isAnesthesia && pName.includes('anesthesia')) return true;
    if (isNutrition && (pName.includes('nutrition') || pName.includes('dietetics'))) return true;
    if (isOptometry && (pName.includes('optometry') || pName.includes('vision'))) return true;
    if (isCardiac && (pName.includes('cardiac') || pName.includes('perfusion') || pName.includes('cardiovascular'))) return true;
    if (isDental && pName.includes('dental')) return true;
    if (isPharm && (pName.includes('pharm') || pName.includes('pharmacy'))) return true;
    if (isMedical && (pName.includes('mbbs') || pName.includes('bds'))) return true;
    if (isNursing && (pName.includes('nursing') || pName.includes('bsn'))) return true;
    if (isLaw && (pName.includes('llb') || pName.includes('law'))) return true;
    if (isCs && (cat.includes('computer science') || pName.includes('computer') || pName.includes('software') || pName.includes('data science') || pName.includes('ai') || pName.includes('cyber'))) return true;
    if (isBusiness && (cat.includes('business') || pName.includes('bba') || pName.includes('mba') || pName.includes('accounting') || pName.includes('finance'))) return true;
    if (isEngineering && (cat.includes('engineering') || pName.includes('engineering') || pName.includes('electrical') || pName.includes('civil') || pName.includes('mechanical'))) return true;
    if (isBio && (pName.includes('bio') || pName.includes('microbiology') || pName.includes('biochemistry'))) return true;

    // Check university matches if specified
    const matchesUniShort = uShort.length >= 3 && query.includes(uShort);
    if (matchesUniShort) return true;

    if (!hasSubjectSignal) {
      const tokens = query.split(/[\s,+/]+/).filter(t => t.length >= 3 && !['master', 'masters', 'bachelor', 'bachelors', 'degree', 'program', 'university', 'college'].includes(t));
      if (tokens.length > 0 && tokens.some(t => pName.includes(t) || cat.includes(t) || uName.includes(t))) {
        return true;
      }
    }

    return false;
  });

  const isSpecific = hasSubjectSignal || (matches.length > 0 && matches.length < programs.length);

  return {
    isSpecific,
    matches: isSpecific && matches.length > 0 ? matches : [],
  };
}

function generateLocalAdvisorRecommendation(input: AdvisorInput, programs: ReturnType<typeof getEnrichedPrograms>): AdvisorResponse {
  const semBudget = input.monthlyBudget * 6;
  const userInterests = (input.interests || '').toLowerCase().trim();

  // Explicit degree level query detection
  const isExplicitMasterQuery = input.degreeLevel === 'Master' || /\b(ms|master|masters|mphil|m\.phil|mph|msph|msc|mba)\b/i.test(userInterests);
  const isExplicitBachelorQuery = input.degreeLevel === 'Bachelor' || /\b(bs|bachelor|bachelors|bsph|bsc|bba|mbbs|dpt|bds|pharm-d)\b/i.test(userInterests);

  const targetDegreeLevel = isExplicitMasterQuery ? 'Master' : isExplicitBachelorQuery ? 'Bachelor' : input.degreeLevel;

  // Filter candidates strictly by degree level
  let candidatePrograms = programs;
  if (targetDegreeLevel === 'Master') {
    const mastersOnly = programs.filter((p) => p.degreeLevel === 'Master');
    if (mastersOnly.length > 0) candidatePrograms = mastersOnly;
  } else if (targetDegreeLevel === 'Bachelor') {
    const bachelorsOnly = programs.filter((p) => p.degreeLevel === 'Bachelor');
    if (bachelorsOnly.length > 0) candidatePrograms = bachelorsOnly;
  }

  // Strict specific search check
  const queryMatch = getMatchingProgramsForQuery(userInterests, candidatePrograms);
  let isSpecificSearch = false;

  if (queryMatch.isSpecific) {
    if (queryMatch.matches.length > 0) {
      candidatePrograms = queryMatch.matches;
      isSpecificSearch = true;
    } else {
      // User searched for a specific field/program that has NO matches in candidate programs
      return {
        recommendations: [],
        generalAdvice: `No matching ${targetDegreeLevel} programs found in the catalog for "${input.interests}". Consider exploring related fields or adjusting search parameters.`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  const scored = candidatePrograms.map((prog) => {
    let score = 80;

    // Province match
    if (input.preferredProvince !== 'Any') {
      if (prog.university.province === input.preferredProvince) score += 20;
      else score -= 10;
    }

    // Budget check
    const feeDiff = prog.feePerSemester - semBudget;
    if (feeDiff <= 0) score += 15;
    else score -= Math.min(25, Math.round(feeDiff / 20000));

    // Marks check
    const isBelowMarks = input.marksPercentage < prog.minPercentageRequired;
    if (isBelowMarks) score -= 15;

    return {
      prog,
      score,
      isBelowMarks,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // If user searched for a specific query, ONLY take matches (max 3), else top 5
  const limitCount = isSpecificSearch ? Math.min(3, candidatePrograms.length) : 5;
  const topMatches = scored.slice(0, limitCount);

  const recs = topMatches.map((m) => {
    const p = m.prog;
    const isUnderBudget = p.feePerSemester <= semBudget;

    let warning = '';
    if (m.isBelowMarks) {
      const deficit = p.minPercentageRequired - input.marksPercentage;
      warning = `⚠️ Cutoff Deficit: Your score (${input.marksPercentage}%) is ${deficit}% below the required minimum (${p.minPercentageRequired}%) for ${p.university.shortName}.`;
    }

    const eligibilityNote = m.isBelowMarks
      ? `Requires ${p.minPercentageRequired}% marks (you have ${input.marksPercentage}%).`
      : `Your ${input.marksPercentage}% marks meet the ${p.minPercentageRequired}% minimum cutoff.`;

    const specificReason = isSpecificSearch
      ? `Exact Requested Match: ${p.name} at ${p.university.name} (${p.university.city}). ${eligibilityNote} Entrance Test: ${p.admissionTestRequired}. Career Outlook: ${p.careerOutlookSummary}`
      : `Recommended Option: ${p.name} at ${p.university.name} (${p.university.city}, ${p.university.province}). ${eligibilityNote} Entrance test: ${p.admissionTestRequired}.`;

    return {
      programId: p.id,
      matchScore: Math.min(99, Math.max(65, m.score + (isSpecificSearch ? 15 : 0))),
      fitReason: specificReason,
      marksWarning: warning,
      feeFitNote: isUnderBudget
        ? `Semester fee (PKR ${p.feePerSemester.toLocaleString()}) fits within your calculated semester budget (PKR ${semBudget.toLocaleString()}).`
        : `Semester fee (PKR ${p.feePerSemester.toLocaleString()}) is higher than your estimated semester budget (PKR ${semBudget.toLocaleString()}). Look into financial aid options.`,
    };
  });

  const topMatch = topMatches[0]?.prog;
  let specificAdvice = '';
  if (topMatch && isSpecificSearch) {
    const marksStatus = input.marksPercentage >= topMatch.minPercentageRequired
      ? `Your ${input.marksPercentage}% marks fulfill the minimum ${topMatch.minPercentageRequired}% requirement.`
      : `Note: Your ${input.marksPercentage}% marks are ${topMatch.minPercentageRequired - input.marksPercentage}% below the required ${topMatch.minPercentageRequired}% cutoff.`;

    specificAdvice = `Specific Admissions Strategy for ${topMatch.name} (${topMatch.university.shortName}):
• Entrance Assessment: Register and prepare for the ${topMatch.admissionTestRequired} exam.
• Cutoff Criteria: ${marksStatus}
• Fee & Duration: PKR ${topMatch.feePerSemester.toLocaleString()} / semester (${topMatch.durationYears} Years program).
• Public Sector Job Pathways: ${topMatch.commonPublicJobs.slice(0, 3).join(', ')}.`;
  } else {
    specificAdvice = `Admissions Strategy Note: For ${topMatch?.name || 'your selected programs'}, ensure you register early for entrance tests like ${topMatch?.admissionTestRequired || 'NTS/NET'}. Your ${input.marksPercentage}% marks meet eligibility for ${scored.filter((s) => !s.isBelowMarks).length} out of ${scored.length} catalog programs.`;
  }

  return {
    recommendations: recs,
    generalAdvice: specificAdvice,
    timestamp: new Date().toISOString(),
  };
}

startServer();
