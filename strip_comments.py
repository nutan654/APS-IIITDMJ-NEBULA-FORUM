import os
import re

def strip_comments_js_ts(content):
    output = []
    i = 0
    n = len(content)
    state = "normal"
    in_string = None
    escape = False
    
    while i < n:
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
        
    result = "".join(output)
    
    # Post-process to remove empty JSX braces left over from {/* comments */}
    # Matches { } with any whitespace inside
    result = re.sub(r'\{\s*\}', '', result)
    
    return result

def strip_comments_css(content):
    output = []
    i = 0
    n = len(content)
    state = "normal"
    in_string = None
    escape = False
    
    while i < n:
        char = content[i]
        
        if state == "normal":
            if i + 1 < n and content[i:i+2] == "/*":
                state = "multi_line_comment"
                i += 2
                continue
            elif char in ('"', "'"):
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
                
        elif state == "multi_line_comment":
            if i + 1 < n and content[i:i+2] == "*/":
                state = "normal"
                i += 2
                continue
                
        i += 1
        
    return "".join(output)

def process_file(filepath):
    print(f"Start processing: {filepath} ...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    ext = os.path.splitext(filepath)[1]
    if ext in ('.ts', '.tsx', '.js', '.jsx'):
        new_content = strip_comments_js_ts(content)
    elif ext == '.css':
        new_content = strip_comments_css(content)
    else:
        return
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Finished processing: {filepath}")

def walk_and_strip():
    target_dirs = ['app', 'lib']
    for target in target_dirs:
        for root, dirs, files in os.walk(target):
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext in ('.ts', '.tsx', '.js', '.jsx', '.css'):
                    filepath = os.path.join(root, file)
                    process_file(filepath)

if __name__ == "__main__":
    walk_and_strip()
    print("Comment stripping complete!")
