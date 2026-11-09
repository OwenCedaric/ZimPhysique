import re, json

with open('6_Weeks_to_a_Hollywood_Body_Steve_Zim/input.md') as f:
    text = f.read()

c6_start = text.find('## Your Hollywood Body Initiation---the First Two Weeks')
c7_start = text.find("## What's Your Hollywood Body Type?")
c6_text = text[c6_start:c7_start]

ex_pattern = re.compile(r'####\s*(?:\[\]\{#chapter06\.html#page_\d+\})?(Hollywood\s+[^\n\{]+)')
matches = list(ex_pattern.finditer(c6_text))
categories = {'Hollywood Legs', 'Hollywood Back', 'Hollywood Shoulders', 'Hollywood Chest', 'Hollywood Arms', 'Hollywood Tricep Exercises', 'Hollywood Bicep Exercises', 'Hollywood Abs'}

exercises = []
for i, m in enumerate(matches):
    title = m.group(1).strip()
    if title in categories:
        continue
    start = m.end()
    end = matches[i+1].start() if i+1 < len(matches) else len(c6_text)
    body = c6_text[start:end]
    
    # parse GET READY
    gr_match = re.search(r'###### GET READY.*?\n(.*?)(?=######|\Z)', body, re.S)
    get_ready = gr_match.group(1).strip() if gr_match else ''
    
    # parse THE EXERCISE
    ex_match = re.search(r'###### THE EXERCISE.*?\n(.*?)(?=######|\Z)', body, re.S)
    the_exercise = ex_match.group(1).strip() if ex_match else ''
    
    # parse STRETCH
    st_match = re.search(r'###### ([^\n]*STRETCH[^\n]*)\n(.*?)(?=######|\Z)', body, re.S)
    stretch_name = st_match.group(1).strip() if st_match else ''
    stretch_desc = st_match.group(2).strip() if st_match else ''
    
    # parse images
    imgs = re.findall(r'!\[image\]\(\./([^)]+)\)', body)
    
    # clean markdown artifacts
    get_ready_clean = re.sub(r'!\[image\]\([^)]+\)', '', get_ready).replace('\n', ' ').strip()
    the_exercise_clean = re.sub(r'!\[image\]\([^)]+\)', '', the_exercise).replace('\n', ' ').strip()
    stretch_desc_clean = re.sub(r'!\[image\]\([^)]+\)', '', stretch_desc).replace('\n', ' ').strip()
    
    exercises.append({
        'title': title,
        'images': imgs,
        'get_ready': get_ready_clean,
        'the_exercise': the_exercise_clean,
        'stretch_name': stretch_name,
        'stretch_desc': stretch_desc_clean
    })

print(f'Successfully parsed {len(exercises)} exercises.')
with open('scratch/parsed_exercises.json', 'w') as out:
    json.dump(exercises, out, ensure_ascii=False, indent=2)

for i, ex in enumerate(exercises):
    print(f"{i+1:02d}. {ex['title']} ({len(ex['images'])} imgs) | stretch: {ex['stretch_name']}")
