"""
Script to populate the vscode extension commands in package.json
"""
from typing import List
import re
from pathlib import Path
from dataclasses import dataclass 

COMMAND_PREFIX = "python-traceback-logger"
TITLE_PREFIX = "PTL:"

@dataclass 
class ExtensionCmd:
    """VSCode extension command, parsed from a typescript file."""
    function_name: str

    @property
    def hr_name(self) -> str:
        """Human readable name."""
        words = re.findall('[A-Z][^A-Z]*', self.function_name)
        starting_word = re.findall('[a-z]+', self.function_name)[0]
        words = [word.capitalize() for word in [starting_word, *words]]
        return " ".join(words)
    
    @property
    def pkg_json_format(self) -> List[str]:
        """Format for package.json."""
        return [
            '{',
            f'    "command": "{COMMAND_PREFIX}.{self.function_name}",',
            f'    "title": "{TITLE_PREFIX} {self.hr_name}"',
            '}'
        ]


def parse_extension_cmds(command_file_path: Path) -> List[ExtensionCmd]:
    """Parse extension commands from typescript file."""
    pattern = re.compile(r'async function ([a-zA-Z0-9_]+)\(')
    file_lines = command_file_path.read_text().splitlines()

    extension_cmds = []
    for line in file_lines:
        match = pattern.match(line)
        if match is not None:
            extension_cmds.append(ExtensionCmd(function_name=match.group(1)))

    return extension_cmds


if __name__ == "__main__":
    repo_root = Path(__file__).parent.parent
    package_json_path = repo_root / "python-traceback-logger" / "package.json"

    command_file_path = repo_root / "python-traceback-logger" / "src" / "commands.ts"

    extension_cmds = parse_extension_cmds(command_file_path)

    lines = package_json_path.read_text().splitlines()
    indent = " " * 8
    start_idx = lines.index(f'{indent}"commands": [')
    end_idx = lines.index(f'{indent}]', start_idx)

    # Remove existing commands
    lines[start_idx + 1 : end_idx] = []

    # Add new commands
    cmd_indent = indent + " " * 4
    for idx, extension_cmd in enumerate(extension_cmds):
        new_lines = extension_cmd.pkg_json_format
        new_lines = [cmd_indent + line for line in new_lines]
        if idx != len(extension_cmds) - 1:
            new_lines[-1] += ","
        lines[start_idx + 1 : start_idx + 1] = new_lines
        start_idx += len(new_lines)
    
    # Write 
    with open(package_json_path, "w") as f:
        f.write("\n".join(lines))
