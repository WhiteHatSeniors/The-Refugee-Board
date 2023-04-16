from core import app

@app.route('/api/get')
def index():
    return {"name":"Hisham","friend":"Afnan"}
