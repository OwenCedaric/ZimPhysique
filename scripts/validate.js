import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { z } from 'zod';

// Strict schema for exercise mistakes
const MistakeSchema = z.object({
    error: z.string().min(1, 'Mistake error is required'),
    manifestation: z.string().min(1, 'Mistake manifestation is required'),
    fix: z.string().min(1, 'Mistake fix is required')
}).strict();

// Strict schema for single exercise
// Disallows any unauthorized keys to prevent AI hallucinations
const ExerciseSchema = z.object({
    id: z.string().min(1, 'Exercise id is required'),
    name: z.string().min(1, 'Exercise name is required'),
    target: z.string().min(1, 'Exercise target is required'),
    setup: z.array(z.string()).min(1, 'Exercise setup must have at least 1 cue/step'),
    cues: z.array(z.string()).min(1, 'Exercise cues must have at least 1 cue/step'),
    mistakes: z.array(MistakeSchema).optional().default([]),
    sets_reps: z.string().min(1, 'sets_reps is required'),
    tempo: z.string().min(1, 'tempo is required'),
    muscle_feeling: z.string().min(1, 'muscle_feeling is required'),
    rest: z.string().min(1, 'rest is required'),
    // Allowed optional coaching fields
    progression: z.union([z.string(), z.array(z.string())]).optional(),
    physiological_effect: z.string().optional(),
    fascial_connection: z.string().optional(),
    clinical_note: z.string().optional(),
    safety_note: z.string().optional(),
    weight_selection: z.union([
        z.string(),
        z.object({
            method: z.string().optional(),
            first_time_estimate: z.string().optional(),
            progression: z.string().optional()
        }).passthrough()
    ]).optional(),
    strategic_positioning: z.string().optional()
}).strict();

// Base Day Plan Schema
const PlanSchema = z.object({
    id: z.string().min(1),
    version: z.number().int().positive(),
    title: z.string().min(1),
    type: z.string().min(1),
    duration: z.string().optional(),
    recovery_interval: z.string().optional(),
    core_philosophy: z.string().optional(),
    core_principle: z.string().optional(),
    target_ratio: z.string().optional(),
    frequency: z.string().optional(),
    equipment: z.union([z.string(), z.array(z.string())]).optional(),
    core_targets: z.union([z.string(), z.array(z.string())]).optional(),
    efficiency_principle: z.string().optional(),
    intensity_level: z.string().optional(),
    optional_execution: z.string().optional(),
    strategic_importance: z.string().optional(),
    sections: z.record(z.string(), z.array(ExerciseSchema))
}).passthrough(); // allows theory/metadata top-level fields

// Master Overview Plan Schema
const OverviewSchema = z.object({
    id: z.string().min(1),
    version: z.number().int().positive(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    program_period: z.string().min(1),
    frequency: z.string().min(1),
    core_philosophy: z.string().optional(),
    current_phase: z.object({
        phase: z.number().int().positive(),
        name: z.string().min(1),
        duration: z.string().optional(),
        core_goals: z.array(z.string()).min(1)
    }),
    weekly_volume_targets: z.record(z.string(), z.any()),
    weekly_schedule: z.record(z.string(), z.any()),
    calibration_rules: z.array(z.string()).optional()
}).passthrough();

export function validateAllPlans(dataDir = './data') {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    let totalErrors = 0;
    let validatedFiles = 0;
    let totalExercises = 0;

    console.log(`\n🔍 Checking ${files.length} plan files in ${dataDir}...\n`);

    for (const file of files) {
        const filePath = path.join(dataDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        let parsed;

        try {
            parsed = YAML.parse(content);
        } catch (e) {
            console.error(`❌ [Syntax Error] ${file}: YAML parsing failed:\n`, e.message);
            totalErrors++;
            continue;
        }

        // Validate master overview separately
        if (file === 'overview.yaml' || file === 'overview.yml') {
            const result = OverviewSchema.safeParse(parsed);
            if (!result.success) {
                console.error(`❌ [Schema Violation] ${file}:`);
                for (const issue of result.error.issues) {
                    console.error(`   - Path: ${issue.path.join('.')} | Error: ${issue.message}`);
                }
                totalErrors++;
            } else {
                validatedFiles++;
                console.log(`✅ ${file.padEnd(16)} Passed (Master Overview Plan verified, 0 errors)`);
            }
            continue;
        }

        const result = PlanSchema.safeParse(parsed);
        if (!result.success) {
            console.error(`❌ [Schema Violation] ${file}:`);
            for (const issue of result.error.issues) {
                console.error(`   - Path: ${issue.path.join('.')} | Error: ${issue.message}`);
            }
            totalErrors++;
            continue;
        }

        // Check for duplicate exercise IDs
        const exerciseIds = new Set();
        let fileExerciseCount = 0;
        let dupErrors = false;

        for (const [sectionName, exercises] of Object.entries(parsed.sections || {})) {
            for (const ex of exercises) {
                fileExerciseCount++;
                totalExercises++;
                if (exerciseIds.has(ex.id)) {
                    console.error(`❌ [Duplicate ID] ${file}: Exercise ID "${ex.id}" is used more than once in section "${sectionName}".`);
                    dupErrors = true;
                    totalErrors++;
                } else {
                    exerciseIds.add(ex.id);
                }
            }
        }

        if (!dupErrors) {
            validatedFiles++;
            console.log(`✅ ${file.padEnd(16)} Passed (${fileExerciseCount} exercises verified, 0 errors)`);
        }
    }

    console.log(`\n--------------------------------------------------`);
    if (totalErrors === 0) {
        console.log(`✨ All ${validatedFiles} files (${totalExercises} exercises) strictly valid!`);
        console.log(`   - 0 unauthorized keys`);
        console.log(`   - 0 missing required fields`);
        console.log(`   - 0 syntax errors\n`);
        return true;
    } else {
        console.error(`💥 Validation failed with ${totalErrors} errors. Please fix above issues.\n`);
        return false;
    }
}

// Run when executed directly
if (process.argv[1] && process.argv[1].endsWith('validate.js')) {
    const success = validateAllPlans();
    process.exit(success ? 0 : 1);
}
