var sampleServiceImpl = {
  getApp: function(req, res) {
    try {
      Application;
      Application2;
      //code to call the pre and post methods of models
      return "successfully returned data from data access object layer ";
    } catch (e) {
      var html = 'GET : Login with username and password <br/><br/>';
      html += 'exports.<b>.getApp</b>.(req, res) {...}<br/><br/>';
      html += 'should be exposed from within <b>server/implementation/.js</b><br/><br/>';
      html += 'you can access <b>app.models[...]</b> to manipulate your data...';
      return html;
    }
  },
  postApp: function(req, res) {
    try {
      Application;
      Application2;
      //code to call the pre and post methods of models
      return "successfully returned data from data access object layer ";
    } catch (e) {
      var html = 'POST : Register new application <br/><br/>';
      html += 'exports.<b>.postApp</b>.(req, res) {...}<br/><br/>';
      html += 'should be exposed from within <b>server/implementation/.js</b><br/><br/>';
      html += 'you can access <b>app.models[...]</b> to manipulate your data...';
      return html;
    }
  }
}
module.exports = sampleServiceImpl;