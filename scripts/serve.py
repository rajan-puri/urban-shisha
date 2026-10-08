from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial, lru_cache
import gzip
import os
from pathlib import Path
class PreviewServer(ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True
@lru_cache(maxsize=64)
def compressed_asset(path, modified):
    return gzip.compress(Path(path).read_bytes(), compresslevel=6)
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.translate_path(self.path)
        if 'gzip' in self.headers.get('Accept-Encoding', '') and Path(path).is_file() and Path(path).suffix in ('.css', '.js', '.html', '.svg'):
            payload = compressed_asset(path, os.stat(path).st_mtime_ns)
            self.send_response(200)
            self.send_header('Content-Type', self.guess_type(path))
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Vary', 'Accept-Encoding')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        else:
            super().do_GET()
    def log_message(self, format, *args):
        pass
root = Path(__file__).resolve().parent.parent
print('Urban Shisha preview: http://127.0.0.1:8091/', flush=True)
PreviewServer(('127.0.0.1',8091),partial(Handler,directory=str(root))).serve_forever()
