with open("app/page.tsx", 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Content length: {len(content)}")
output = []
i = 0
n = len(content)
state = "normal"
in_string = None
escape = False

# Print progress every 10%
progress_milestone = n // 10

while i < n:
    if i % progress_milestone == 0:
        print(f"Progress: {i/n*100:.1f}%, index: {i}, state: {state}, char: {repr(content[i:i+5])}")
        
    char = content[i]
    
    if state == "normal":
        if i + 1 < n and content[i:i+2] == "//":
            state = "single_line_comment"
            i += 2
            continue
        elif i + 1 < n and content[i:i+2] == "/*":
            state = "multi_line_comment"
            i += 2
            continue
        elif char in ('"', "'", "`"):
            state = "string"
            in_string = char
            escape = False
            output.append(char)
        else:
            output.append(char)
    
    elif state == "string":
        output.append(char)
        if escape:
            escape = False
        elif char == "\\":
            escape = True
        elif char == in_string:
            state = "normal"
            in_string = None
            
    elif state == "single_line_comment":
        if char == "\n":
            state = "normal"
            output.append("\n")
            
    elif state == "multi_line_comment":
        if i + 1 < n and content[i:i+2] == "*/":
            state = "normal"
            i += 2
            continue
            
    i += 1

print("Loop finished successfully!")
result = "".join(output)
print(f"Result length: {len(result)}")
