"""Test script."""
from tb_logger import TracebackLogger
from pathlib import Path

tb_logger = TracebackLogger()


def slice_even_chars(
    str_to_slice: str
):
    """Slice every even-indexed character in a string."""
    tb_logger.log({"str_to_slice": str_to_slice})
    even_chars = str_to_slice[::2]
    return str_to_slice[::2]



if __name__ == "__main__":
    strs_to_slice = [
        "spaghetti",
        "man",
        "milk_man",
        "dan",
        "dori"
    ]

    for str_to_slice in strs_to_slice:
        slice_even_chars(str_to_slice)
    
    

    tb_logger.save_logs(
        str(
            Path(__file__).parent.joinpath("test_script.json")
        )
    )

    
