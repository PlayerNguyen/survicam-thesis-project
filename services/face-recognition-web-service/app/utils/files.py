import mimetypes

def is_acceptable_file(file_name):
    # Get the MIME type of the file
    mime_type, _ = mimetypes.guess_type(file_name)
    
    # Define acceptable MIME types
    acceptable_mime_types = {'image/jpeg', 'image/png'}
    
    # Check if the MIME type is acceptable
    return mime_type in acceptable_mime_types