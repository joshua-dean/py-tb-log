from tb_logger.tb_logger import TracebackLogger

def call_main():
    """Call main function."""
    main()

def main():
    """Main function."""
    logger = TracebackLogger()
    logger.log({'test': 'test'})
    logger.save_logs('./test.json')
    # print(logger.logged_data[0].as_dict())
    # print(logger.logged_data[0].data)
    # print(logger.logged_data[0].traceback)


if __name__ == '__main__':
    call_main()
