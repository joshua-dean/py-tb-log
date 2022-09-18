"""Traceback logger for python."""
import logging 
import traceback

class DataEntry():
    """Data entry class."""
    def __init__(self, data, traceback):
        self.data = data
        self.traceback = traceback

class TracebackLogger():
    """Traceback logger for python."""
    def __init__(self, name: str = None, logger: logging.Logger = None):
        self.logger = logger if logger is not None else logging.getLogger(name)
        self.logged_data = []
    
    def log(self, data: dict, level: int = None):
        """Log data."""
        self.logged_data.append(
            DataEntry(
                data,
                traceback.extract_stack()[:-1]
            )
        )
        if level is not None:
            self.logger.log(level, data)