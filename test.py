from tb_logger import TracebackLogger

def call_main():
    """Call main function."""
    main()

def main():
    """Main function."""
    logger = TracebackLogger()
    logger.log({'test': 'test'})
    print(logger.logged_data[0].data)
    print(logger.logged_data[0].traceback)


if __name__ == '__main__':
    call_main()
