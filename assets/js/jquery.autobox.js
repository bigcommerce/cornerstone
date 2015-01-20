/*
* Vekz
* http://www.callmekev.com/jquery.autobox.js
* autobox plugin -
* Used on text inputs with default values. Clears the default value on focus.
* Restores the default value on blur if empty or the same
* overlays text inputs for password boxes and swaps them on focus
* use straight CSS for styling the focus of the text input
* 
*/

jQuery.fn.autobox = function(options){  
  var settings = $.extend({defaultClass : 'default', filledClass : 'filled'}, options);
  
  return this.each(function (){
    var textInput = $(this);
    var defaultVal = textInput.val();
    textInput.addClass(settings.defaultClass);
    
    if(textInput.attr('type') == 'password'){
      var newInput = $('<input type="text" class="'+settings.defaultClass+'"value="'+textInput.val()+'" />');
      newInput.css({
        'position' : 'absolute',
        'z-index' : 10,
        'top' : textInput.position().top+'px',
        'left' : textInput.position().left+'px'
      });
      
      $(window).resize(function(){
        newInput.css({
          'top' : textInput.position().top+'px',
          'left' : textInput.position().left+'px'
        });
      });
      
      newInput.bind('focus', function(){
        var $this = $(this);
        $this.hide();
        textInput.show();
        textInput.css({'visibility' : 'visible'});
        textInput.focus();
      });
      
      textInput.before(newInput);
    }
    
    textInput.bind('focus', function(){
      var $this = $(this);
      $this.removeClass(settings.defaultClass);
      $this.addClass(settings.filledClass);
      if($this.val() == defaultVal){
        $this.val('');
      }
    });
      
    textInput.bind('blur', function(){
      var $this = $(this);
      if($this.val() == ''){
        $this.val(defaultVal);
        $this.addClass(settings.defaultClass);
        $this.removeClass(settings.filledClass);
        if($this.attr('type') == 'password'){
          newInput.show();
        }
      }else{
        $this.addClass(settings.filledClass);
      }
    });
  });
};