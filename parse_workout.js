const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '训练计划.md');
const outputFile = path.join(__dirname, 'workout_data.js');

try {
    const markdown = fs.readFileSync(inputFile, 'utf8');
    const lines = markdown.split('\n');

    const workoutData = {
        daily: [],
        monday: [],
        wednesday: [],
        friday: [],
        saturday: [],
        sunday: []
    };

    let currentSection = null; // 'daily', 'monday', 'wednesday', 'friday', 'saturday', 'sunday'
    let currentExercise = null;
    let buffer = [];

    // Helper to save current exercise
    const saveExercise = () => {
        if (currentExercise && currentSection) {
            // Process buffer for the last exercise to extract details
            parseDetails(currentExercise, buffer);
            workoutData[currentSection].push(currentExercise);
            buffer = [];
        }
    };

    // Helper to refine text
    const cleanLine = (line) => line.trim();

    // Regex patterns
    const sectionRegex = /^\s*###\s+(.*)/; // ### 模块A / ### 周一
    const exerciseRegex = /^\s*####\s+(\d+)\.\s+(.*)/; // #### 1. 死虫式...

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect Sections
        const sectionMatch = line.match(sectionRegex);
        if (sectionMatch) {
            saveExercise();
            currentExercise = null;

            const title = sectionMatch[1];

            // Logic to distinguish daily modules from weekend modules
            // Weekend modules appear AFTER the main week days in the file logic, 
            // but physically in the file, we can rely on order if we track state, or simply keywords.
            // Based on previous grep, "Module A: 溜肩专项" and "Module B: 骨盆前倾" are definitely weekend.

            if (title.includes('每日') || (title.includes('模块') && workoutData.monday.length === 0)) {
                currentSection = 'daily';
            } else if (title.includes('周一')) {
                currentSection = 'monday';
            } else if (title.includes('周三')) {
                currentSection = 'wednesday';
            } else if (title.includes('周五')) {
                currentSection = 'friday';
            } else if (title.includes('模块A')) {
                // Occurs after daily modules have been processed
                currentSection = 'saturday';
            } else if (title.includes('模块B')) {
                currentSection = 'sunday';
            }
            // Continue to next line
            continue;
        }

        // Detect Exercises
        const exerciseMatch = line.match(exerciseRegex);
        if (exerciseMatch) {
            saveExercise(); // Save previous
            currentExercise = {
                id: exerciseMatch[1],
                name: exerciseMatch[2],
                target: '',
                setup: [],
                cues: [],
                mistakes: [],
                sets_reps: '',
                tempo: '',
                muscle_feeling: '',
                rest: ''
            };
            buffer = [];
            continue;
        }

        // Collect content for current exercise
        if (currentExercise) {
            buffer.push(line);
        }
    }
    // Save last exercise
    saveExercise();

    // Parser for detailed attributes within an exercise buffer
    function parseDetails(exercise, lines) {
        let mode = 'general';

        lines.forEach(line => {
            const clean = line.trim();
            if (!clean) return;

            if (line.includes('**目标肌肉：**')) {
                exercise.target = clean.replace(/\*\*目标肌肉：\*\*/, '').trim();
            }
            else if (line.includes('**起始位置：**')) {
                mode = 'setup';
            }
            else if (line.includes('**Zim式技术要点：**') || line.includes('技术要点：')) {
                mode = 'cues';
            }
            else if (line.includes('**常见错误与修正：**') || line.includes('常见错误')) {
                mode = 'mistakes';
            }
            else if (line.includes('**剂量：**') || line.includes('组数/次数：')) {
                exercise.sets_reps = clean.replace(/\*\*.*：\*\*/, '').trim();
            }
            else if (line.includes('**节奏：**')) {
                exercise.tempo = clean.replace(/\*\*节奏：\*\*/, '').trim();
            }
            else if (line.includes('**肌肉感受：**')) {
                exercise.muscle_feeling = clean.replace(/\*\*肌肉感受：\*\*/, '').trim();
            }
            else if (line.includes('**休息：**')) {
                exercise.rest = clean.replace(/\*\*休息：\*\*/, '').trim();
            }
            else {
                // Determine content based on mode
                if (mode === 'setup') {
                    if (clean.startsWith('├') || clean.startsWith('└') || clean.startsWith('│')) {
                        exercise.setup.push(clean);
                    } else if (clean.startsWith('```')) {
                        // ignore code blocks markers
                    } else {
                        // Text inside start position block
                        if (clean.length > 2) exercise.setup.push(clean);
                    }
                } else if (mode === 'cues') {
                    if (clean.includes('阶段') || clean.startsWith('-') || clean.startsWith('**')) {
                        exercise.cues.push(clean);
                    }
                } else if (mode === 'mistakes') {
                    // Table parsing or list parsing
                    if (clean.startsWith('|')) {
                        // Simple table extraction
                        const parts = clean.split('|').filter(p => p.trim());
                        if (parts.length >= 3 && !clean.includes('---') && !clean.includes('错误')) {
                            exercise.mistakes.push({
                                error: parts[0].trim(),
                                manifestation: parts[1].trim(),
                                fix: parts[2].trim()
                            });
                        }
                    }
                }
            }
        });
    }

    const outputContent = `const WORKOUT_DATA = ${JSON.stringify(workoutData, null, 2)};`;

    fs.writeFileSync(outputFile, outputContent);
    console.log('Successfully parsed workout data to workout_data.js');
    console.log('Daily exercises:', workoutData.daily.length);
    console.log('Monday exercises:', workoutData.monday.length);
    console.log('Wednesday exercises:', workoutData.wednesday.length);
    console.log('Friday exercises:', workoutData.friday.length);
    console.log('Saturday exercises:', workoutData.saturday.length);
    console.log('Sunday exercises:', workoutData.sunday.length);

} catch (err) {
    console.error('Error parsing file:', err);
}
