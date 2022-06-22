from flask import Flask, request, jsonify
import socket

def get_hostname():
    return socket.gethostname()

app = Flask(__name__)


@app.route('/')
def message():
    return jsonify(
        text=f'This is an example - {get_hostname()}'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False, threaded=True)
