from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def message():
    return jsonify(
        text='This is an example'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False, threaded=True)
