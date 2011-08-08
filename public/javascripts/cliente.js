var patch;
var mainloop;
$(document).ready(function() {
  // initialize vvvv.js; this loads the rest of the .js files
  // first argument is the path to the vvvv_js folder
  // second argument is either 'run', to load only run components, 'view' to load only vvvviewer, or 'full' to load both
  initVVVV("javascripts", 'full');
  
  // load the .v4p file and run the mainloop. this paragraph is basically all you need to run a vvvv patch
  patch = new VVVV.Core.Patch("/v4p/example01.v4p", function() {
    mainloop = new VVVV.Core.MainLoop(this);
  });
  
  // register button events

  $('#start_button').click(function() {
    mainloop.start();
    $(this).attr('disabled', true);
    $('#stop_button').attr('disabled',null);
  });
  
  $('#stop_button').click(function() {
    mainloop.stop();
    $(this).attr('disabled', true);
    $('#start_button').attr('disabled',null);
  });
  
  $('#show_button').click(function() {
    var vvvviewer = new VVVV.VVVViewer(patch, '#viewer_pane');
    $(this).attr('disabled', true);
  });
  
});

