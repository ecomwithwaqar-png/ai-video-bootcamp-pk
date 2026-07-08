import re

with open("e:/skool project/ghl pakistan/src/components/CheckoutPanel.jsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

stack = []
for idx, line in enumerate(lines):
    line_num = idx + 1
    # Simple regex to find JSX tags (opening and closing)
    # Match tag name e.g. <div or </div or <section or </section
    tags = re.findall(r'</?([a-zA-Z0-9\-]+)(?:\s|/?>|$)', line)
    
    # We should also check for self-closing tags in the line
    self_closing = re.findall(r'<([a-zA-Z0-9\-]+)[^>]*/>', line)
    
    for tag in tags:
        # If the tag is a comment or inside quotes, skip it (very basic check)
        if line.strip().startswith("//") or line.strip().startswith("/*"):
            continue
        
        # If it's a closing tag
        if f"</{tag}>" in line or f"</{tag} " in line or line.strip() == f"</{tag}>" or re.search(r'</' + tag + r'\s*>', line):
            if stack and stack[-1][0] == tag:
                stack.pop()
            else:
                print(f"Error: unmatched closing tag </{tag}> on line {line_num}")
                if stack:
                    print(f"Current stack top: <{stack[-1][0]}> opened on line {stack[-1][1]}")
        else:
            # It's an opening tag
            # Check if it is self-closing (e.g. <input ... />)
            # In JSX, tags like input, img, br, hr, span (if self closing), etc can be self-closed
            is_self_closed = False
            if tag in self_closing:
                is_self_closed = True
            elif re.search(r'<' + tag + r'[^>]*/>', line):
                is_self_closed = True
                
            if not is_self_closed and tag not in ['input', 'img', 'br', 'hr']: # common HTML self-closing
                stack.append((tag, line_num))

print("Final Stack size:", len(stack))
for tag, line in stack:
    print(f"Unclosed tag <{tag}> opened on line {line}")
