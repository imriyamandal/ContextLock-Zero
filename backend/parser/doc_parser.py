"""
Document Parser for ContextLock Zero.
Extracts clean structured text, sections, and metadata from:
- PDF (.pdf)
- Markdown (.md)
- Plain text (.txt)
- JSON (.json)
- Git Commit History (.json or .txt logs)
"""
import io
import json
import os
from typing import Dict, Any, List
import pypdf

def parse_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF pages."""
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        text_content = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            text_content.append(f"--- Page {i+1} ---\n{page_text}")
        return "\n\n".join(text_content)
    except Exception as e:
        return f"[PDF Extraction Error: {str(e)}]"

def parse_markdown(text: str) -> str:
    return text.strip()

def parse_json(text: str) -> str:
    try:
        data = json.loads(text)
        return json.dumps(data, indent=2)
    except Exception:
        return text

def parse_git_commits(content: str) -> List[Dict[str, Any]]:
    """Parse JSON or text format git commits."""
    try:
        data = json.loads(content)
        if isinstance(data, list):
            return data
    except Exception:
        pass
    
    # Fallback line-by-line parser for git logs
    commits = []
    current_commit = {}
    for line in content.splitlines():
        line = line.strip()
        if line.startswith("commit "):
            if current_commit:
                commits.append(current_commit)
            current_commit = {"hash": line.replace("commit ", ""), "details": ""}
        elif line.startswith("Author:"):
            current_commit["author"] = line.replace("Author:", "").strip()
        elif line.startswith("Date:"):
            current_commit["date"] = line.replace("Date:", "").strip()
        elif line:
            current_commit["details"] = (current_commit.get("details", "") + " " + line).strip()
    if current_commit:
        commits.append(current_commit)
    return commits

def parse_docx(file_bytes: bytes) -> str:
    """Extract structured text and paragraphs from Microsoft Word (.docx)."""
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = []
        for i, p in enumerate(doc.paragraphs):
            text = p.text.strip()
            if text:
                paragraphs.append(text)
        # Also parse tables
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                if row_text:
                    paragraphs.append(row_text)
        return "\n\n".join(paragraphs)
    except Exception as e:
        return f"[DOCX Extraction Error: {str(e)}]"

def parse_text(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")

def parse_markdown(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore").strip()

def parse_json(file_bytes: bytes) -> str:
    text = file_bytes.decode("utf-8", errors="ignore")
    try:
        data = json.loads(text)
        return json.dumps(data, indent=2)
    except Exception:
        return text

def parse_git_log(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")

SUPPORTED_ROUTER = {
    ".pdf": parse_pdf,
    ".docx": parse_docx,
    ".doc": parse_docx,
    ".md": parse_markdown,
    ".markdown": parse_markdown,
    ".txt": parse_text,
    ".json": parse_json,
    ".log": parse_git_log
}

def parse_uploaded_file(filename: str, content_bytes: bytes) -> Dict[str, Any]:
    """Universal parser router returning metadata and extracted string."""
    ext = os.path.splitext(filename)[1].lower()
    
    parser_fn = SUPPORTED_ROUTER.get(ext, parse_text)
    try:
        text = parser_fn(content_bytes)
    except Exception as e:
        text = content_bytes.decode("utf-8", errors="ignore")
        
    ext_to_type = {
        ".pdf": "PDF",
        ".docx": "DOCX",
        ".doc": "DOCX",
        ".md": "Markdown",
        ".markdown": "Markdown",
        ".json": "JSON",
        ".txt": "TXT",
        ".log": "LOG"
    }
    filetype = ext_to_type.get(ext, "TXT")
        
    return {
        "filename": filename,
        "filetype": filetype,
        "content": text
    }

