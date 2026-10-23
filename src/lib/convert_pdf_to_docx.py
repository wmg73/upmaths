#!/usr/bin/env python3
"""PDF -> DOCX conversion helper using pdf2docx.

Usage: python3 pdf2docx.py <input.pdf> <output.docx>
Exit code 0 on success, non-zero on failure.
"""
import sys
import warnings

warnings.filterwarnings("ignore")

try:
    from pdf2docx import Converter
except ImportError:
    print("ERROR: pdf2docx not installed. Run: pip3 install pdf2docx", file=sys.stderr)
    sys.exit(2)


def main():
    if len(sys.argv) != 3:
        print("Usage: pdf2docx.py <input.pdf> <output.docx>", file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    try:
        cv = Converter(input_path)
        cv.convert(output_path)
        cv.close()
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(3)


if __name__ == "__main__":
    main()
