import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { validateAllPlans } from './validate.js';

/**
 * Precision Patch Tool for Zim Workout Plans
 * Allows safe, targeted updates to exercises without rewriting the entire file,
 * guaranteeing zero data loss and strict schema preservation.
 *
 * Example:
 *   node scripts/patch-plan.js --day monday --id s1 --sets_reps "4 组 × 8-10 次" --tempo "4-2-2-1"
 */

function parseArgs() {
    const args = process.argv.slice(2);
    const params = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].replace(/^--/, '');
            const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
            params[key] = value;
            if (value !== true) i++;
        }
    }
    return params;
}

function runPatch() {
    const params = parseArgs();
    const day = params.day;
    const exerciseId = params.id;

    if (!day || !exerciseId) {
        console.log(`
Usage:
  node scripts/patch-plan.js --day <dayKey> --id <exerciseId> [options]

Options:
  --day <key>            e.g. monday, tuesday, daily
  --id <id>              e.g. s1, w1, st2
  --sets_reps <string>   Update sets/reps
  --tempo <string>       Update tempo
  --cues <json-array>    Update cues (JSON array string)
  --rest <string>        Update rest duration
  --patch <json-string>  Update multiple fields via JSON snippet

Examples:
  node scripts/patch-plan.js --day monday --id s1 --sets_reps "4 组 × 8-10 次" --tempo "4-2-2-1"
  node scripts/patch-plan.js --day monday --id s1 --patch '{"sets_reps":"4 组 × 8-10 次","rest":"90 秒"}'
`);
        process.exit(1);
    }

    const filePath = path.join('./data', `${day}.yaml`);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Plan file not found: ${filePath}`);
        process.exit(1);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = YAML.parse(raw);

    // Locate the exercise across all sections
    let foundExercise = null;
    let foundSection = null;

    for (const [secName, exercises] of Object.entries(data.sections || {})) {
        if (Array.isArray(exercises)) {
            const idx = exercises.findIndex(ex => ex.id === exerciseId);
            if (idx !== -1) {
                foundExercise = exercises[idx];
                foundSection = secName;
                break;
            }
        }
    }

    if (!foundExercise) {
        console.error(`❌ Exercise with ID "${exerciseId}" not found in ${day}.yaml`);
        process.exit(1);
    }

    // Apply updates
    let updates = {};
    if (params.patch) {
        try {
            updates = typeof params.patch === 'string' ? JSON.parse(params.patch) : params.patch;
        } catch (e) {
            console.error(`❌ Failed to parse --patch JSON:`, e.message);
            process.exit(1);
        }
    }

    // Standard field flags
    const allowedFields = [
        'name', 'target', 'setup', 'cues', 'mistakes',
        'sets_reps', 'tempo', 'muscle_feeling', 'rest',
        'progression', 'weight_selection', 'safety_note'
    ];

    for (const field of allowedFields) {
        if (params[field] !== undefined) {
            let val = params[field];
            if (['setup', 'cues', 'mistakes'].includes(field) && typeof val === 'string' && val.startsWith('[')) {
                try {
                    val = JSON.parse(val);
                } catch {
                    // keep string
                }
            }
            updates[field] = val;
        }
    }

    console.log(`\n📝 Applying targeted update to [${day}.yaml -> ${foundSection} -> ${foundExercise.id} (${foundExercise.name})]:`);
    for (const [k, v] of Object.entries(updates)) {
        console.log(`   - ${k}: ${JSON.stringify(foundExercise[k])} -> ${JSON.stringify(v)}`);
        foundExercise[k] = v;
    }

    // Bump version if not explicitly updated
    if (!updates.version && typeof data.version === 'number') {
        data.version += 1;
        console.log(`   - version: ${data.version - 1} -> ${data.version}`);
    }

    // Write back to YAML
    const updatedYaml = YAML.stringify(data, {
        indent: 2,
        lineWidth: 0,
        singleQuote: false
    });

    fs.writeFileSync(filePath, updatedYaml, 'utf-8');
    console.log(`💾 Saved ${filePath}`);

    // Run strict validator immediately
    console.log(`\n🔍 Verifying schema after patch...`);
    const valid = validateAllPlans();
    if (!valid) {
        console.error(`❌ Patch caused schema violation! Rolling back...`);
        fs.writeFileSync(filePath, raw, 'utf-8');
        process.exit(1);
    }

    console.log(`🎉 Patch completed and verified successfully!\n`);
}

runPatch();
