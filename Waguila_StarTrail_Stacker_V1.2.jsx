// Star Trail Creative Style - Waguila_CreativeStarTrail_V1.0.jsx
// Creative Commons Attribution - http://waguila.weebly.com
// Release Beta, 11-Sept-2013 by Salim Waguila
// Inspired and used as baseline by http://liketheocean.com/night-photography/
//
// This script  open the folder where all the pictures are (user will select the folder when the select forlder window pops out)
// Must have at least 2 files in the folder for this script to work
// This script offer a way to select the desired effect at runtime (User interface used)
// This script opens file by file and applies the chosen blend mode, applies the effect on the layer and merge down
// this will optimise the use of the memory and also to make the process a bit faster when using more than 300 files
// Prerequisite : Put this script in photoshop script folder or browse and run, only use jpg files
//
// Help your fellow photographer by donating at http://waguila.weebly.com
// Enjoy

#target photoshop
app.bringToFront();
main();
function main()
{
    try
    {
        app.documents[0].name;
        alert ("Please close all open documents ... and re-run the script again !!");
        return;
    }
    catch(e)
    {
        // no document is open ... carry on
    }

    /// This part is to allow the user Select the folder where all the star trail pictures are exported
    /// ONLY JPG files are supported
    selectedFolder = Folder.selectDialog( "Please select input folder");
    if(selectedFolder == null) return;
    var fileList = selectedFolder.getFiles(/\.(jpg|jpeg)$/i);
    
    //at least 2 pictures in the folder otherwise these is nothing to do :)   
    if (fileList.length<2) 
    {
        alert ("Please select a folder with 2 or more JPG file you wanna stack");
        return;
    }
    
    /// Lets choose our options
    var win= new Window('dialog', 'Star Stacking Options');
    BlendPanel = win.add("panel", undefined, " SET Blend Mode ", {borderStyle:"r"});
    BlendPanel.orientation = "column";
    BlendPanel.alignment='left';
    BlendPanel.preferredSize = [200,107];
    BlendPanel.spacing=0;

    grProd1 =BlendPanel.add('group');
    grProd1.orientation = 'row';
    grProd1.alignment="left";
    

     LightenBlendRadio = BlendPanel.add('radiobutton',undefined,'Lighten');
     LightenBlendRadio.alignment='left';
     LightenBlendRadio.value = true;
     ScreenBlendRadio = BlendPanel.add('radiobutton',undefined,'Screen');
     ScreenBlendRadio.alignment='left';
     NormalBlendRadio = BlendPanel.add('radiobutton',undefined,'Normal');
     NormalBlendRadio.alignment='left';
        
     CreativeEffectsPanel =  win.add("panel", undefined, " SELECT Creative Style ", {borderStyle:"r"});
     CreativeEffectsPanel.orientation = "column";
     CreativeEffectsPanel.alignment='left';
     CreativeEffectsPanel.preferredSize = [200,107];
     CreativeEffectsPanel.spacing=0;

     grProd2 =CreativeEffectsPanel.add('group');
     grProd2.orientation = 'row';
     grProd2.alignment="left";
        
     NoEffectRadio = CreativeEffectsPanel.add('radiobutton',undefined,'Merges all shots with set BLEND MODE (No EFFECTS)');
     NoEffectRadio.alignment='left';
     NoEffectRadio.value = true;
     CometEffectLtoRRadio = CreativeEffectsPanel.add('radiobutton',undefined,'Comet Style left to right (light to dark)');
     CometEffectLtoRRadio.alignment='left';
     CometEffetRtoLRadio = CreativeEffectsPanel.add('radiobutton',undefined,'Comet Style right to left');
     CometEffetRtoLRadio.alignment='left';
     SaucerEffectRadio = CreativeEffectsPanel.add('radiobutton',undefined,'Saucer Style');
     SaucerEffectRadio.alignment='left';
     SpaceShipEffectRadio = CreativeEffectsPanel.add('radiobutton',undefined,'Space ship Style');
     SpaceShipEffectRadio.alignment='left';
     WaguilaZeroOpacityEffectRadio = CreativeEffectsPanel.add('radiobutton',undefined,'Waguila Zero Opacity Style');
     WaguilaZeroOpacityEffectRadio.alignment='left';
     WaguilaTotalOpacityEffectRadio = CreativeEffectsPanel.add('radiobutton',undefined,'Waguila Total Opacity Style');
     WaguilaTotalOpacityEffectRadio.alignment='left';
        
     CreativeEffectsPanel =  win.add("panel", undefined, " Effect Option ", {borderStyle:"r"});
     CreativeEffectsPanel.orientation = "column";
     CreativeEffectsPanel.alignment='left';
     CreativeEffectsPanel.preferredSize = [200,107];
     CreativeEffectsPanel.spacing=0;
     grProd2 =CreativeEffectsPanel.add('group');
     grProd2.orientation = 'row';
     grProd2.alignment="left";
     cometlayerCheckbox = CreativeEffectsPanel.add('checkbox',undefined,'Add a final layer for Star Spike Pro effect (Applies only for Comet effect)');
     cometlayerCheckbox.alignment='left';
     cometlayerCheckbox.value = true;
     
     grProd3 =win.add('group');
     
     Process = grProd3.add('button',undefined,"Process");
     Process.bounds = [10,80,190,101];
     Cancel = grProd3.add('button',undefined,"Cancel");
     Cancel.bounds = [210,80,390,101];
     
     //BlendModeSelection Variable , Defaults to Lighten Mode
     // LIGHTEN is the best option for star processing. Results might not be pleasing if changed
    
     LightenBlendRadio.onClick = function() 
     {
         BlendModeSelection = BlendMode.LIGHTEN;
     };        
        
     ScreenBlendRadio.onClick = function() 
     {
         BlendModeSelection = BlendMode.SCREEN;
     };
        
     NormalBlendRadio.onClick = function() 
     {
         BlendModeSelection = BlendMode.NORMAL;
     };
 
     var BlendModeSelection = BlendMode.LIGHTEN;
     var GroupLayerBeforeMerge = 5; 
     var EffectSelection = 0;
     var opacity = 0;
     var cometEffectStarSpikeLayer = true;
     // Some calculation before stacking the pictures
     var MAX_OPACITY = 100;
     var numberOfLayers = fileList.length;
     var increments = MAX_OPACITY / numberOfLayers;
     var case56Opacity = 0; ///default case 5
     var case34Opacity = 100; //default for 3
     
     NoEffectRadio.onClick = function() 
     {
         EffectSelection = 0;
     };
        
     CometEffectLtoRRadio.onClick = function() 
     {
         EffectSelection = 1;
         opacity = 100;    
     };
        
     CometEffetRtoLRadio.onClick = function() 
     {
         EffectSelection = 2;
         opacity = 0;
     };
    
     SaucerEffectRadio.onClick = function() 
     {
        EffectSelection = 3;
        case34Opacity = 100;
     };
        
     SpaceShipEffectRadio.onClick = function() 
     {
         EffectSelection = 4;
         case34Opacity = 0;
     };
     
     WaguilaZeroOpacityEffectRadio.onClick = function() 
     {
         EffectSelection = 5;
         case56Opacity = 0;
     };
 
      WaguilaTotalOpacityEffectRadio.onClick = function() 
     {
         EffectSelection = 6;
         case56Opacity = 100;
     };
 
     var proceed = false;
     Process.onClick = function()
     {
        proceed = true;
         cometEffectStarSpikeLayer = cometlayerCheckbox.value;
         win.close(1);
     };
    win.show();

    /// If proceed button is clicked the process of stacking will start
    if (!proceed)
    {
        return;
    }


    
    open(fileList[1]);
    checkBackGround();
    
    /// Initialization of the first layer according to the effect selected
    switch(EffectSelection) 
          {
              case 0:
              case 1:
              break;
              
              case 2 : activeDocument.layers[0].opacity = 0; break;
             
              case 3 : 
              case 4 :
              {
                  if (numberOfLayers <25)
                  {
                      alert("To apply this effect, you need minimum 25 photos");
                      return;
                  }
              
                  var r = numberOfLayers - 5;
                  var edges = r/2;
                  var middle = numberOfLayers- (edges*2); /// edges*2 to just get the missing frame in case the layers # is a even number
                  var Case34Increments = MAX_OPACITY/edges;
                  activeDocument.layers[0].opacity = 0;
              }
              break;
              case 5 :
              case 6 :
              {
                  if (numberOfLayers <25)
                  {
                      alert("To apply this effect, you need minimum 25 photos");
                      return;
                  }
              
                  var r = numberOfLayers - 5;
                  var edges = r/2;
                  var middle = numberOfLayers- (edges*2); /// edges*2 to just get the missing frame in case the layers # is a even number
                  var Case56Increments = MAX_OPACITY/edges;
                  activeDocument.layers[0].opacity = 100;
              }
              break;
              default : 
              {
                  alert("Selected effect is not supported yet at the moment");
                  return;
              }
           }
     
     //case 34-56 variable
     var ZeroOpacity = 0;
     var TotalOpacity = 100;
     
    for(var z = 0;z<fileList.length;z++)
    {
        if (z == 1) continue;
         open(fileList[z]);
         checkBackGround();
         duplicateLayer(app.documents[0].name);
         app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
         
         //var doc = app.activeDocument;
         // do the magic :)

          activeDocument.layers[0].blendMode = BlendModeSelection; 
            
          switch(EffectSelection) 
          {
          
              case 0 : break; 
              case 1 : 
              {
                  if (opacity < 0) {opacity = 0 ;} 
                  activeDocument.layers[0].opacity = opacity;
                  opacity = opacity - increments ; 
              }
              break;
              case 2 : 
              {
                  opacity = opacity + increments ; 
                  if (opacity > 100) {opacity = 100 ;} 
		         activeDocument.layers[0].opacity = opacity;
              }
              break;
             
              case 3 : 
              case 4 :
              {
                  if (z<edges)
                  {
                      //increase opacity
                      ZeroOpacity = ZeroOpacity + Case34Increments ; 
                      if (ZeroOpacity > 100) {ZeroOpacity = 100 ;} 
                      activeDocument.layers[0].opacity = ZeroOpacity;
                  } else if (z<(edges+middle))
                  {
                      activeDocument.layers[0].opacity = case34Opacity;
                  } else
                  {
                      //decrease opacity
                      if (ZeroOpacity < 0) {ZeroOpacity = 0 ;}	
                      activeDocument.layers[0].opacity = ZeroOpacity;
                      ZeroOpacity = ZeroOpacity - Case34Increments ; 
                  }
              }
              break;
          
          case 5 :
          case 6 :
           if (z<edges)
                  {
                      //increase opacity
                      if (TotalOpacity < 0) {TotalOpacity = 0 ;}	
                      activeDocument.layers[0].opacity = TotalOpacity;
                      TotalOpacity = TotalOpacity - Case56Increments ; 
                  } else if (z<(edges+middle))
                  {
                      // keep opacity % controled by user (case 5 = 0 case 6 = 100)
                      activeDocument.layers[0].opacity = case56Opacity;
                  } else
                  { //increase opacity
                      TotalOpacity = TotalOpacity + Case56Increments ; 
                      if (TotalOpacity > 100) {TotalOpacity = 100 ;} 
                      activeDocument.layers[0].opacity = TotalOpacity;
                  }
              break;
              default : 
              {
                  alert("Selected effect is not supported yet at the moment");
                  return;
              }
           }
            
            if ((z==fileList.length-1) || (z%GroupLayerBeforeMerge==0))
            {
                mergeLayers();
             }
     }
 
     if ((EffectSelection == 1) && cometEffectStarSpikeLayer)
     {
         open(fileList[0]);
         checkBackGround();
         duplicateLayer(app.documents[0].name);
         app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
         activeDocument.layers[0].blendMode = BlendModeSelection; 
     }
     else if ((EffectSelection == 2) && cometEffectStarSpikeLayer)
     {
         open(fileList[fileList.length-1]);
         checkBackGround();
         duplicateLayer(app.documents[0].name);
         app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
         activeDocument.layers[0].blendMode = BlendModeSelection; 
     }
}


function confirm(str)
{
   msgbox(str);
}

function checkBackGround()
{
    activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
    if(activeDocument.activeLayer.isBackgroundLayer)
    {
        activeDocument.activeLayer.name=activeDocument.activeLayer.name;
    }
}

function mergeLayers()
{
    selectAllLayers() ;
    activeDocument.activeLayer.merge();
};


function duplicateLayer(DocName) 
{
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc.putReference( charIDToTypeID('null'), ref );
    var ref2 = new ActionReference();
    ref2.putName( charIDToTypeID('Dcmn'), DocName);
    desc.putReference( charIDToTypeID('T   '), ref2 );
    desc.putInteger( charIDToTypeID('Vrsn'), 5 );
    executeAction( charIDToTypeID('Dplc'), desc, DialogModes.NO );
};

function selectAllLayers() 
{
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc.putReference( charIDToTypeID('null'), ref );
    executeAction( stringIDToTypeID('selectAllLayers'), desc, DialogModes.NO );
};


