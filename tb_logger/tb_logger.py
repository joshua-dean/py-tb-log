"""Traceback logger for python."""
from importlib.util import set_loader
import os
import logging
import traceback
import json 
from pathlib import Path
from typing import List


def frame_summary_to_str(frame_summary: traceback.FrameSummary) -> str:
    """Convert frame summary to string."""
    fs_path = Path(frame_summary.filename).as_posix()
    return f"{fs_path}: line {frame_summary.lineno} in {frame_summary.name}"


def strip_common_non_file_prefixes_from_frame_summaries(
    frame_summaries: List[traceback.FrameSummary],
) -> List[str]:
    """Strip common prefixes that aren't the actual file."""
    parents = [
        Path(frame_summary.filename).parent.as_posix()
        for frame_summary in frame_summaries
    ]
    common_prefix = os.path.commonprefix(parents)
    if common_prefix != "" and common_prefix[-1] != "/":
        common_prefix += "/"
    return [
        frame_summary_to_str(fs).replace(common_prefix, "") for fs in frame_summaries
    ]


class DataEntry:
    """Data entry class."""

    def __init__(
        self,
        data,
        traceback: List[traceback.FrameSummary],
        strip_common_prefix: bool = True,
    ):
        """Initialize data entry."""
        self.data = data
        self.traceback = traceback
        if strip_common_prefix:
            self.traceback_frames = strip_common_non_file_prefixes_from_frame_summaries(
                traceback
            )
        else:
            self.traceback_frames = [frame_summary_to_str(fs) for fs in traceback]

    def as_dict(self):
        """Return as dict."""
        return {"data": self.data, "traceback": self.traceback_frames}


class TracebackLogger:
    """Traceback logger for python."""

    def __init__(
        self,
        name: str = None,
        logger: logging.Logger = None,
        strip_common_prefix: bool = True,
    ):
        self.logger = logger if logger is not None else logging.getLogger(name)
        self.logged_data = []
        self.strip_common_prefix = strip_common_prefix

    def log(self, data: dict, level: int = None):
        """Log data."""
        self.logged_data.append(
            DataEntry(data, traceback.extract_stack()[:-1], self.strip_common_prefix)
        )
        if level is not None:
            self.logger.log(level, data)
    
    def save_logs(self, path: str):
        """Save logs to file."""
        with open(path, 'w') as f:
            json.dump([d.as_dict() for d in self.logged_data], f, indent=4)
