enchant();

var Key_z = false;
var Key_x = false;
var Key_c = false;
var Key_s = false;
var Stage_X = 0;
var Stage_Y = 0;
var Character_X = 0;
var Character_Y = 0;
var Character_direction = "右";
var Flag = {};
var Chat = "最初";
var Stage = "最初";
var COOLTime = {c_key:0,s_key:0,run:0,down:0,right:0,left:0,up:0};
var Run = false;
var Pad_opacity = 0;
var Change_Box = null;
var Move_box = null;
var Move_box_length = 0;

var SE1 = document.createElement("audio");
var SE2 = document.createElement("audio");
var BGM = document.createElement("audio");

BGM.addEventListener("ended",function(e){
  BGM.currentTime = BGM.id;
  BGM.play();
});

window.addEventListener("keydown",function(e){
  Pad_opacity = 0;
  switch(e.key){
    case "z":
      Key_z = true;
      break;
    case "x":
      Key_x = true;
      break;
    case "c":
      Key_c = true;
      break;
    case "s":
      Key_s = true;
      break;
  }
});

window.addEventListener("keyup",function(e){
  switch(e.key){
    case "z":
      Key_z = false;
      break;
    case "x":
      Key_x = false;
      break;
    case "c":
      Key_c = false;
      break;
    case "s":
      Key_s = false;
      break;
  }
});

function Flag_judgement(a,b,c){
  if(Flag[a]==undefined) Flag[a] = 0;
  var Judge = null;
  switch(b){
    case "=":
      if(Flag[a]==c) Judge = true;
      else Judge = false;
      break;
    case "<":
      if(Flag[a]<c) Judge = true;
      else Judge = false;
      break;
    case ">":
      if(Flag[a]>c) Judge = true;
      else Judge = false;
      break;
  }
  return(Judge);
};

function Game_load(width,height){

  var game = new Game(width,height);
  game.fps = 20;
  game.onload = function(){

    var Main_Scene = function(Datas){

      var scene = new Scene();

      if(!Datas){
        Datas = {画像:{}};
      }

      if(Change_Box){
        for (var i = 0; i < Change_Box.length; i++) {
          var Reg = new RegExp(Change_Box[i][0],"g");
          Datas = JSON.stringify(Datas);
          Datas = Datas.replace(Reg,Change_Box[i][1]);
          Datas = JSON.parse(Datas);
        };
      };
      console.log(Datas);

      var i = 0;
      var Image = [];
      var Images_Data = {};
      var Z_Run = false;
      var Rotate = 0;
      var Ground = 0;
      var Gravity = 9.8;
      var Jump_s = 1;
      var Jump_power = 50;
      var Stage_width = 1600;
      var Stage_height = 900;
      var Friction = 10;
      var E_X = 0;
      var E_Y = 0;
      var E_E = null;
      if(Datas.設定){
        if(Datas.設定.BGM){
          BGM.name1 = Datas.設定.BGM;
          if(BGM.name1 != BGM.name2){
            BGM.src = BGM.name1;
            BGM.name2 = BGM.name1;
            if(BGM.src){
              if(BGM.paused) BGM.play();
              else BGM.currentTime = 0;
              if(Datas.設定.BGMED) BGM.id = Datas.設定.BGMED;
              else BGM.id = 0;
            }
          }
        }
        if(Datas.設定.地面) Ground += Datas.設定.地面;
        if(Datas.設定.回転) Rotate = Datas.設定.回転;
        if(Datas.設定.重力) Gravity = Datas.設定.重力;
        if(Datas.設定.摩擦) Friction = Datas.設定.摩擦;
        if(Datas.設定.ジャンプ) Jump_s = Datas.設定.ジャンプ;
        if(Datas.設定.ジャンプ音) SE2.src = Datas.設定.ジャンプ音;
        if(Datas.設定.ジャンプ力) Jump_power = Datas.設定.ジャンプ力;
        if(Datas.設定.ステージ幅) Stage_width = Datas.設定.ステージ幅;
        if(Datas.設定.ステージ高さ) Stage_height = Datas.設定.ステージ高さ;
      }

      function Images(){
        Image[i] = new Sprite();
        Image[i]._element = document.createElement("img");
        if(Object.keys(Datas.画像)[i]=="人"){
          if(Datas.人){
            if(Datas.人.左 || Datas.人.右){
              if(Datas.人.右) Image[i].url = Datas.人.右[1];
              if(Datas.人.左) Image[i].url = Datas.人.左[1];
            }
            else Image[i].url = "image/model1.png";
          }
          else Image[i].url = "image/model1.png";
        }
        else{
          if(Datas.画像[Object.keys(Datas.画像)[i]].src){
            Image[i].url = Datas.画像[Object.keys(Datas.画像)[i]].src;
          }
        }
        if(Image[i].url) Image[i]._element.src = Image[i].url;
        else Image[i]._element.src = "image/透明.png";
        Image[i].width = Datas.画像[Object.keys(Datas.画像)[i]].width;
        Image[i].height = Datas.画像[Object.keys(Datas.画像)[i]].height;
        Image[i].x = Datas.画像[Object.keys(Datas.画像)[i]].x;
        Image[i].y = Datas.画像[Object.keys(Datas.画像)[i]].y;
        Image[i].x_origin = Image[i].x;
        Image[i].y_origin = Image[i].y;
        Image[i].name = Object.keys(Datas.画像)[i];
        if(Datas.画像[Object.keys(Datas.画像)[i]].opacity!=undefined) Image[i].opacity = Datas.画像[Object.keys(Datas.画像)[i]].opacity;
        Images_Data[Image[i].name] = i;
        scene.addChild(Image[i]);
        if(HTML == "編集") Images_atarihantei();
        return;
      };

      if(HTML == "編集"){
        var Image_atarihantei = [];
        function Images_atarihantei(){
          Image_atarihantei[i] = new Sprite();
          Image_atarihantei[i]._element = document.createElement("img");
          Image_atarihantei[i]._element.src = "image/配置.png";
          Image_atarihantei[i].x = Image[i].x;
          Image_atarihantei[i].y = Image[i].y;
          Image_atarihantei[i].width = Image[i].width;
          Image_atarihantei[i].height = Image[i].height;
          scene.addChild(Image_atarihantei[i]);
          return;
        };
      }

      function Character_direction_decision(){
        switch(Image[Images_Data.人].状態){
          case "空中":
            if(Character_direction == "右"){
              if(Image[Images_Data.人].空中右) Image[Images_Data.人].scaleX = 1;
              else Image[Images_Data.人].scaleX = -1;
            }
            else{
              if(Image[Images_Data.人].空中左) Image[Images_Data.人].scaleX = 1;
              else Image[Images_Data.人].scaleX = -1;
            }
            break;
          case "停止":
            if(Character_direction == "右"){
              if(Image[Images_Data.人].右) Image[Images_Data.人].scaleX = 1;
              else Image[Images_Data.人].scaleX = -1;
            }
            else{
              if(Image[Images_Data.人].左) Image[Images_Data.人].scaleX = 1;
              else Image[Images_Data.人].scaleX = -1;
            }
            break;
          default:
            if(Run||Z_Run){
              if(Character_direction == "右"){
                if(Image[Images_Data.人].走右) Image[Images_Data.人].scaleX = 1;
                else Image[Images_Data.人].scaleX = -1;
              }
              else{
                if(Image[Images_Data.人].走左) Image[Images_Data.人].scaleX = 1;
                else Image[Images_Data.人].scaleX = -1;
              }
            }
            else{
              if(Character_direction == "右"){
                if(Image[Images_Data.人].歩右) Image[Images_Data.人].scaleX = 1;
                else Image[Images_Data.人].scaleX = -1;
              }
              else{
                if(Image[Images_Data.人].歩左) Image[Images_Data.人].scaleX = 1;
                else Image[Images_Data.人].scaleX = -1;
              }
            }
            break;
        }
        return;
      }

      var Frame_wait = 0;
      var Frame_status = null;
      var Frame_wait_Number = null;

      function Frame_advance(){
        var Direction = Character_direction;
        if(Image[Images_Data.人].状態!="停止"){
          if(Image[Images_Data.人].状態=="空中"){
            Direction = "空中" + Direction;
          }
          else{
            if(Run||Z_Run) Direction = "走" + Direction;
            else Direction = "歩" + Direction;
          }
        }
        if(!Image[Images_Data.人][Direction]){
          Direction = Direction.replace(/右/g,"左");
        }
        if(!Image[Images_Data.人][Direction]){
          Direction = Direction.replace(/左/g,"右");
        }
        if(Image[Images_Data.人][Direction]){
          for(var i = 1; i < Object.keys(Image[Images_Data.人][Direction]).length + 1; i++){
            if(Frame_wait){
              if(Frame_wait==1) Image[Images_Data.人].Number = Frame_wait_Number + 2;
              Frame_wait--;
              if(Frame_wait){
                Image[Images_Data.人].Number = Frame_wait_Number;
                Image[Images_Data.人]._element.src = Image[Images_Data.人][Direction][Frame_wait_Number];
                Character_direction_decision();
                return;
              }
            }
            if(i >= Object.keys(Image[Images_Data.人][Direction]).length){
              Image[Images_Data.人].Number = 1;
              Image[Images_Data.人]._element.src = Image[Images_Data.人][Direction][1];
              Character_direction_decision();
              break;
            }
            if(Image[Images_Data.人].Number == i){
              if(Object.keys(Image[Images_Data.人][Direction]).length == i) i = 1;
              else i++;
              if(Frame_wait==0){
                if(!JSON.stringify((Image[Images_Data.人][Direction][i])).match(/\D/)){
                  Frame_wait_Number = i - 1;
                  Frame_wait = Image[Images_Data.人][Direction][i];
                }
                else{
                  Image[Images_Data.人].Number = i;
                  Image[Images_Data.人]._element.src = Image[Images_Data.人][Direction][i];
                  Character_direction_decision();
                }
              }
              break;
            }
          }
        }
        return;
      };

      function State_change(a){
        if(Frame_status!=a){
          Frame_status = a;
          Image[Images_Data.人].状態 = a;
          Frame_wait = 0;
          Image[Images_Data.人].Number = 1;
          switch(a){
            case "空中":
              if(Character_direction=="右") console.log("空中で右を向いている。");
              else console.log("空中で左を向いている。");
              Image[Images_Data.人].ジャンプ = Jump_s - 1;
              break;
            case "動":
              if(Character_direction=="右"){
                if(Run|Z_Run) console.log("右に走っている。");
                else console.log("右に歩いている。");
              }
              else{
                if(Run|Z_Run) console.log("左に走っている。");
                else console.log("左に歩いている。");
              }
              break;
            case "停止":
              if(Character_direction=="右") console.log("右を向いている。");
              else console.log("左を向いている。");
              break;
            default:
              console.log("キャラ不明。");
              break;
          }
        }
        return;
      }

      function Touch(a,b){
        var c = Image[Images_Data[b.対象]];
        if(b.右){
          if(a.x < Image[Images_Data[b.接触]].x) return;
        }
        if(b.左){
          if(a.x > Image[Images_Data[b.接触]].x) return;
        }
        if(b.上){
          if(a.y > Image[Images_Data[b.接触]].y) return;
        }
        if(b.下){
          if(a.y < Image[Images_Data[b.接触]].y) return;
        }
        if(b.フラグ){
          if(b["フラグ="]!=undefined){
            if(!Flag_judgement(b.フラグ,"=",b["フラグ="])) return;
          }
          if(b["フラグ<"]!=undefined){
            if(!Flag_judgement(b.フラグ,"<",b["フラグ<"])) return;
          }
          if(b["フラグ>"]!=undefined){
            if(!Flag_judgement(b.フラグ,">",b["フラグ>"])) return;
          }
        };
        if(a.intersect(Image[Images_Data[b.接触]])){
          if(b.真値!=undefined) c[b.データ] = b.真値;
        }
        else{
          if(b.偽値!=undefined) c[b.データ] = b.偽値;
        };
        return;
      };

      for(var i = 0; i < Object.keys(Datas.画像).length; i++){
          if(Datas.画像[Object.keys(Datas.画像)[i]].フラグ){
            if(Datas.画像[Object.keys(Datas.画像)[i]]["="]!=undefined){
              if(Flag_judgement(Datas.画像[Object.keys(Datas.画像)[i]].フラグ,"=",Datas.画像[Object.keys(Datas.画像)[i]]["="])){
                Images();
              }
            }
            if(Datas.画像[Object.keys(Datas.画像)[i]]["<"]!=undefined){
              if(Flag_judgement(Datas.画像[Object.keys(Datas.画像)[i]].フラグ,"<",Datas.画像[Object.keys(Datas.画像)[i]]["<"])){
                Images();
              }
            }
            if(Datas.画像[Object.keys(Datas.画像)[i]][">"]!=undefined){
              if(Flag_judgement(Datas.画像[Object.keys(Datas.画像)[i]].フラグ,">",Datas.画像[Object.keys(Datas.画像)[i]][">"])){
                Images();
              }
            }
          }
          else Images();
      };

      Human_set("初回");

      function Human_set(a){
        if(Datas.画像.人){
          if(Datas.人){
            if(Datas.人.右) Image[Images_Data.人].右 = Datas.人.右;
            else Image[Images_Data.人].右 = false;
            if(Datas.人.左) Image[Images_Data.人].左 = Datas.人.左;
            else Image[Images_Data.人].左 = false;
            if(Datas.人.歩右) Image[Images_Data.人].歩右 = Datas.人.歩右;
            else Image[Images_Data.人].歩右 = false;
            if(Datas.人.歩左) Image[Images_Data.人].歩左 = Datas.人.歩左;
            else Image[Images_Data.人].歩左 = false;
            if(Datas.人.走右) Image[Images_Data.人].走右 = Datas.人.走右;
            else Image[Images_Data.人].走右 = false;
            if(Datas.人.走左) Image[Images_Data.人].走左 = Datas.人.走左;
            else Image[Images_Data.人].走左 = false;
            if(Datas.人.空中右) Image[Images_Data.人].空中右 = Datas.人.空中右;
            else Image[Images_Data.人].空中右 = false;
            if(Datas.人.空中左) Image[Images_Data.人].空中左 = Datas.人.空中左;
            else Image[Images_Data.人].空中左 = false;
          };
          if(!Image[Images_Data.人].左&&!Image[Images_Data.人].右){
            Image[Images_Data.人].左 = {1:"image/model1.png"};
          };
          if(!Image[Images_Data.人].歩左&&!Image[Images_Data.人].歩右){
            Image[Images_Data.人].歩左 = {
              1:"image/model2.png",
              2:"image/model3.png",
              3:"image/model4.png",
              4:"image/model5.png",
              5:"image/model6.png",
              6:"image/model7.png",
              7:"image/model8.png",
              8:"image/model7.png",
              9:"image/model6.png",
              10:"image/model5.png",
              11:"image/model4.png",
              12:"image/model3.png"
            };
          };
          if(!Image[Images_Data.人].走左&&!Image[Images_Data.人].走右){
            Image[Images_Data.人].走左 = {1:"image/model2.png",2:"image/model8.png"};
          };
          if(!Image[Images_Data.人].空中左&&!Image[Images_Data.人].空中右){
            Image[Images_Data.人].空中左 = {1:"image/model9.png"};
          };
          if(a=="初回"){
            console.log(Datas.人);
            if(Image[Images_Data.人].y < height - Image[Images_Data.人].height - Ground){
              State_change("空中");
            }
            else State_change("停止");
            if(Stage_X == "右端") Stage_X = Stage_width - 1600;
            if(Character_X == "右端") Character_X = 1600 - Image[Images_Data.人].width;
            for (var i = 0; i < Image.length; i++) {
              if(Image[i].name != "人") Image[i].x = Image[i].x_origin - Stage_X;
            };
            if(HTML == "編集"){
              for (var i = 0; i < Image_atarihantei.length; i++) {
                Image_atarihantei[i].x = Image[i].x_origin - Stage_X;
              };
            };
            Image[Images_Data.人].Number = 1;
            Image[Images_Data.人].横加速度 = 0;
            Image[Images_Data.人].縦加速度 = 0;
            Image[Images_Data.人].地面 = Ground;
            Image[Images_Data.人].x = Character_X;
            Character_direction_decision();
          };
        };
      };

      function keydown(Value){
        var k = 1;
        var Execution = true;
        for(var i = 0; i < Object.keys(Value).length; i++){
          while(Value[Object.keys(Value)[i]][k]){
            if(Value[Object.keys(Value)[i]][k]["接触"]){
              if(!Image[Images_Data.人].intersect(Image[Images_Data[Value[Object.keys(Value)[i]][k]["接触"]]])){
                Execution = false;
                break;
              }
            }
            if(Value[Object.keys(Value)[i]][k]["フラグ"]){
              if(Value[Object.keys(Value)[i]][k]["="]!=undefined){
                Execution = Flag_judgement(Value[Object.keys(Value)[i]][k]["フラグ"],"=",Value[Object.keys(Value)[i]][k]["="]);
              }
              if(Value[Object.keys(Value)[i]][k]["<"]!=undefined){
                Execution = Flag_judgement(Value[Object.keys(Value)[i]][k]["フラグ"],"<",Value[Object.keys(Value)[i]][k]["<"]);
              }
              if(Value[Object.keys(Value)[i]][k][">"]!=undefined){
                Execution = Flag_judgement(Value[Object.keys(Value)[i]][k]["フラグ"],">",Value[Object.keys(Value)[i]][k][">"]);
              }
              if(!Execution) break;
            }
            k++;
          }
          if(Execution){
            if(Value[Object.keys(Value)[i]].対象){
              Image[Images_Data[Value[Object.keys(Value)[i]].対象]][Value[Object.keys(Value)[i]].データ] = Value[Object.keys(Value)[i]].値;
            }
            if(Value[Object.keys(Value)[i]].x!=undefined){
              if(Value[Object.keys(Value)[i]].x=="右端") Character_X = "右端";
              else Character_X = Value[Object.keys(Value)[i]].x - Stage_X;
              Image[Images_Data.人].x = Character_X;
            }
            if(Value[Object.keys(Value)[i]].y!=undefined){
              if(Value[Object.keys(Value)[i]].y=="左端") Character_Y = "左端";
              else Character_Y = Value[Object.keys(Value)[i]].y - Stage_Y;
              Image[Images_Data.人].y = Character_Y;
            }
            if(Value[Object.keys(Value)[i]].ステージx!=undefined){
              Stage_X = Value[Object.keys(Value)[i]].ステージx;
            }
            if(Value[Object.keys(Value)[i]].向き){
              Character_direction = Value[Object.keys(Value)[i]].向き;
              Character_direction_decision();
            }
            if(Value[Object.keys(Value)[i]].ステージ移動){
              Stage = Value[Object.keys(Value)[i]].ステージ移動;
              Key_z = false;
              Key_x = false;
              Key_c = false;
              game.input.up = false;
              game.input.down = false;
              game.input.left = false;
              game.input.right = false;
              Scene_Check_Scene(Stage_Datas[Stage]);
              return;
            }
            if(Value[Object.keys(Value)[i]].text){
              Character_X = Image[Images_Data.人].x;
              X_B.opacity = 0;
              C_B.opacity = 0;
              Z_B.opacity = 0;
              Pad1.opacity = 0;
              Key_z = false;
              Key_x = false;
              Key_c = false;
              game.input.up = false;
              game.input.down = false;
              game.input.left = false;
              game.input.right = false;
              Chat = Value[Object.keys(Value)[i]].text;
              game.pushScene(Chat_Scene(Stage_Datas[Chat]));
              break;
            }
          }
          k = 1;
          Execution = true;
        }
        return;
      };

      var Object_mood = false;
      var Change_object = false;

      scene.addEventListener("touchstart",function(e){
        if(Hensyu_mood){
          if(Haiti_mood){
            if(e.y > 900) return;
            Haiti_image_x = Math.floor(e.x);
            Haiti_image_y = Math.floor(e.y);
          }
        }
        else{
          Pad_opacity = 1;
          E_X = Math.floor(e.x);
          E_Y = Math.floor(e.y);
        }
      });

      scene.addEventListener("touchend",function(e){
        if(Object_mood){
          if(Change_object != Pull_down1._element.value){
            Change_object = Pull_down1._element.value;
            if(Image[Images_Data[Change_object]].url){
              Inputs[10]._element.value = Image[Images_Data[Change_object]].url;
            }
            else Inputs[10]._element.value = "";
            Inputs[11]._element.value = Image[Images_Data[Change_object]].x + Stage_X;
            Inputs[12]._element.value = Image[Images_Data[Change_object]].y - Stage_Y;
            Inputs[13]._element.value = Image[Images_Data[Change_object]].width;
            Inputs[14]._element.value = Image[Images_Data[Change_object]].height;
            Inputs[15]._element.value = Image[Images_Data[Change_object]].opacity;
          }
        }
        else{
          if(Hensyu_mood){
            if(Haiti_mood&&Haiti_image_x){
              Datas.画像[Inputs[0]._element.value] = {
                width:(Math.floor(e.x)-Haiti_image_x),
                height:(Math.floor(e.y)-Haiti_image_y),
                x:Haiti_image_x + Stage_X,
                y:Haiti_image_y - Stage_Y
              }
              if(Inputs[1]._element.value) Datas.画像[Inputs[0]._element.value].src = Inputs[1]._element.value;
              Stage_Datas[Stage] = Datas;
              Scene_Check_Scene(Stage_Datas[Stage]);
              return;
            }
          }
          else{
            E_E = ':{width:'+(Math.floor(e.x)-E_X)+',height:'+(Math.floor(e.y)-E_Y)+',x:'+E_X+',y:'+E_Y+'},';
            console.log(E_E);
          }
        }
      });

      scene.addEventListener("enterframe",function(){
        if(Human_image_add_mood){
          Frame_advance();
          Inputs[2]._element.placeholder = Pull_down3._element.value;
          Inputs[2]._element.placeholder += "の画像URL";
        }
        if(!Hensyu_mood){
          X_B.opacity = Pad_opacity;
          C_B.opacity = Pad_opacity;
          Z_B.opacity = Pad_opacity;
          Pad1.opacity = Pad_opacity;
          for(var i = 0; i < Object.keys(COOLTime).length; i++){
            if(COOLTime[Object.keys(COOLTime)[i]] > 0) COOLTime[Object.keys(COOLTime)[i]]--;
          }
          if(Key_s && COOLTime.s_key == 0){
            COOLTime.s_key = 5;
            var Save = {
              1:{
                text:"セーブしますか？",
                選択肢:{
                  3:{
                    text:"はい",
                    next:"セーブ"
                  },
                  2:{
                    text:"いいえ"
                  },
                  1:{
                    text:"セーブ削除",
                    next:"削除"
                  }
                }
              },
              セーブ:{
                text:"セーブしました。",
                セーブ:"セーブ"
              },
              削除:{
                text:"既存セーブを削除しました。●ゲームは続けることができます。",
                セーブ:"削除"
              }
            };
            game.pushScene(Chat_Scene(Save));
            return;
          };
          if(Key_c && COOLTime.c_key == 0){
            COOLTime.c_key = 5;
            if(Datas.cキー) keydown(Datas.cキー);
          };
          if(Image[Images_Data.人]){
            if(Key_x){
              if(Image[Images_Data.人].ジャンプ){
                if(Image[Images_Data.人].縦加速度 >= 0){
                  if(SE2.src){
                    if(SE2.paused) SE2.play();
                    else SE2.currentTime = 0;
                  }
                  Image[Images_Data.人].ジャンプ--;
                  Image[Images_Data.人].縦加速度 -= Jump_power;
                  State_change("空中");
                }
              }
            };
            if(Datas.接触){
              for(var i = 0; i < Object.keys(Datas.接触).length; i++){
                Touch(Image[Images_Data.人],Datas.接触[Object.keys(Datas.接触)[i]]);
              }
            };
            Z_Run = Key_z;
            if(1600 + Stage_X == Stage_width){
              if(Stage_X == 0) Image[Images_Data.人].x += Image[Images_Data.人].横加速度;
              else{
                if(Image[Images_Data.人].x == width/2 - Image[Images_Data.人].width/2){
                  Stage_X += Image[Images_Data.人].横加速度;
                  if(1600 + Stage_X > Stage_width){
                    Stage_X = Stage_width - 1600;
                    Image[Images_Data.人].x += Image[Images_Data.人].横加速度;
                  }
                  for (var i = 0; i < Image.length; i++) {
                    if(Image[i].name != "人") Image[i].x = Image[i].x_origin - Stage_X;
                  };
                  if(HTML == "編集"){
                    for (var i = 0; i < Image_atarihantei.length; i++) {
                      Image_atarihantei[i].x = Image[i].x_origin - Stage_X;
                    };
                  };
                }
                else{
                  Image[Images_Data.人].x += Image[Images_Data.人].横加速度;
                  if(Image[Images_Data.人].x < width/2 - Image[Images_Data.人].width/2){
                    Image[Images_Data.人].x = width/2 - Image[Images_Data.人].width/2;
                  };
                }
              }
            }
            else{
              if(Image[Images_Data.人].x == width/2 - Image[Images_Data.人].width/2){
                Stage_X += Image[Images_Data.人].横加速度;
                if(Stage_X < 0){
                  Stage_X = 0;
                  Image[Images_Data.人].x += Image[Images_Data.人].横加速度;
                }
                if(1600 + Stage_X > Stage_width) Stage_X = Stage_width - 1600;
                for (var i = 0; i < Image.length; i++) {
                  if(Image[i].name != "人") Image[i].x = Image[i].x_origin - Stage_X;
                };
                if(HTML == "編集"){
                  for (var i = 0; i < Image_atarihantei.length; i++) {
                    Image_atarihantei[i].x = Image[i].x_origin - Stage_X;
                  };
                };
              }
              else{
                if(Image[Images_Data.人].x < width/2 - Image[Images_Data.人].width/2){
                  Image[Images_Data.人].x += Image[Images_Data.人].横加速度;
                  if(Image[Images_Data.人].x > width/2 - Image[Images_Data.人].width/2){
                    Image[Images_Data.人].x = width/2 - Image[Images_Data.人].width/2;
                  };
                };
              };
            };
            if(Image[Images_Data.人].状態 == "空中"){
              Image[Images_Data.人].縦加速度 += Gravity;
              Image[Images_Data.人].rotation += Rotate;
              if(900 - Stage_Y == Stage_height){
                if(Stage_Y == 0) Image[Images_Data.人].y += Image[Images_Data.人].縦加速度;
                else{
                  if(Image[Images_Data.人].y == 450 - Image[Images_Data.人].height/2){
                    Stage_Y += Image[Images_Data.人].縦加速度;
                    if(900 - Stage_Y > Stage_height){
                      Stage_Y = (Stage_height - 900)*-1;
                      Image[Images_Data.人].y += Image[Images_Data.人].縦加速度;
                    }
                    for (var i = 0; i < Image.length; i++) {
                      if(Image[i].name != "人") Image[i].y = Image[i].y_origin - Stage_Y;
                    };
                    if(HTML == "編集"){
                      for (var i = 0; i < Image_atarihantei.length; i++) {
                        Image_atarihantei[i].y = Image[i].y_origin - Stage_Y;
                      };
                    };
                  }
                  else{
                    Image[Images_Data.人].y += Image[Images_Data.人].縦加速度;
                    if(Image[Images_Data.人].y > 450 - Image[Images_Data.人].height/2){
                      Image[Images_Data.人].y = 450 - Image[Images_Data.人].height/2;
                    };
                  };
                }
              }
              else{
                if(Image[Images_Data.人].y == 450 - Image[Images_Data.人].height/2){
                  Stage_Y += Image[Images_Data.人].縦加速度;
                  if(Stage_Y > 0){
                    Stage_Y = 0;
                    Image[Images_Data.人].y += Image[Images_Data.人].縦加速度;
                  }
                  if(900 - Stage_Y > Stage_height) Stage_Y = (Stage_height - 900)*-1;
                  for (var i = 0; i < Image.length; i++) {
                    if(Image[i].name != "人") Image[i].y = Image[i].y_origin - Stage_Y;
                  };
                  if(HTML == "編集"){
                    for (var i = 0; i < Image_atarihantei.length; i++) {
                      Image_atarihantei[i].y = Image[i].y_origin - Stage_Y;
                    };
                  };
                }
                else{
                  if(Image[Images_Data.人].y > 450 - Image[Images_Data.人].height/2){
                    Image[Images_Data.人].y += Image[Images_Data.人].縦加速度;
                    if(Image[Images_Data.人].y < 450 - Image[Images_Data.人].height/2){
                      Image[Images_Data.人].y = 450 - Image[Images_Data.人].height/2;
                    };
                  };
                };
              };
            };
            Ground = Image[Images_Data.人].地面;
            if(HTML == "編集") Ground += 900;
            if(Image[Images_Data.人].y < height - Image[Images_Data.人].height - Ground){
              State_change("空中");
            }
            else{
              Image[Images_Data.人].ジャンプ = Jump_s;
              Image[Images_Data.人].縦加速度 = 0;
              Image[Images_Data.人].y = height - Image[Images_Data.人].height - Ground;
              if(Image[Images_Data.人].状態 == "空中"){
                State_change("停止");
                Image[Images_Data.人].rotation = 0;
              }
            };
            if(game.input.up && COOLTime.up == 0){
              COOLTime.up = 5;
              if(Datas.上キー) keydown(Datas.上キー);
            };
            if(game.input.down && COOLTime.down==0){
              console.log("StageData = " + JSON.stringify(Datas));
              console.log("キャラx = " + Image[Images_Data.人].x);
              console.log("キャラy = " + Image[Images_Data.人].y);
              console.log("ステージx = " + Stage_X);
              console.log("ステージy = " + Stage_Y);
              console.log("Flag = " + JSON.stringify(Flag));
              COOLTime.down = 5;
              if(Datas.下キー) keydown(Datas.下キー);
            };
            if(game.input.left == game.input.right){
              Run = false;
              Z_Run = false;
              if(Image[Images_Data.人].横加速度 != 0){
                if(Image[Images_Data.人].横加速度 > 0){
                  Image[Images_Data.人].横加速度 -= Friction;
                  if(Image[Images_Data.人].横加速度 < 0) Image[Images_Data.人].横加速度 = 0;
                }
                else if(Image[Images_Data.人].横加速度 < 0){
                  Image[Images_Data.人].横加速度 += Friction;
                  if(Image[Images_Data.人].横加速度 > 0) Image[Images_Data.人].横加速度 = 0;
                }
              }
              if(Image[Images_Data.人].状態 != "空中") State_change("停止");
            };
            if(game.input.left && !game.input.right){
              if(Image[Images_Data.人].状態 != "空中") State_change("動");
              if(Datas.設定) {
                if(Datas.設定.回転) Rotate = - Datas.設定.回転;
              }
              Character_direction = "左";
              if(COOLTime.left > 0 && COOLTime.left != 4) Run = true;
              COOLTime.left = 5;
              COOLTime.right = 0;
              if(Run||Z_Run){
                Image[Images_Data.人].横加速度 -= Friction * 4;
                if(Image[Images_Data.人].横加速度 < -40) Image[Images_Data.人].横加速度 = -40;
              }
              else{
                if(Image[Images_Data.人].横加速度 > -20) Image[Images_Data.人].横加速度 -= Friction;
                if(Image[Images_Data.人].横加速度 < -20) Image[Images_Data.人].横加速度 += Friction;
              }
            };
            if(game.input.right && !game.input.left){
              if(Image[Images_Data.人].状態 != "空中") State_change("動");
              if(Datas.設定) {
                if(Datas.設定.回転) Rotate = Datas.設定.回転;
              }
              Character_direction = "右";
              if(COOLTime.right > 0 && COOLTime.right != 4) Run = true;
              COOLTime.left = 0;
              COOLTime.right = 5;
              if(Run||Z_Run){
                Image[Images_Data.人].横加速度 += Friction * 4;
                if(Image[Images_Data.人].横加速度 > 40) Image[Images_Data.人].横加速度 = 40;
              }
              else{
                if(Image[Images_Data.人].横加速度 < 20) Image[Images_Data.人].横加速度 += Friction;
                if(Image[Images_Data.人].横加速度 > 20) Image[Images_Data.人].横加速度 -= Friction;
              }
            };
            Frame_advance();
            if(Datas.移動データ){
              if(Datas.移動データ.右){
                if(Image[Images_Data.人].x >= 1600){
                  if(Datas.移動データ.右x) Character_X = Datas.移動データ.右x;
                  else Character_X = 0;
                  if(Datas.移動データ.右ステージx) Stage_X = Datas.移動データ.右ステージx;
                  else Stage_X = 0;
                  if(Datas.移動データ.右ステージy) Stage_Y = Datas.移動データ.右ステージy;
                  else Stage_Y = 0;
                  if(Datas.移動データ.右向き) Character_direction = Datas.移動データ.右向き;
                  Stage = Datas.移動データ.右;
                  Key_z = false;
                  Key_x = false;
                  Key_c = false;
                  game.input.up = false;
                  game.input.down = false;
                  game.input.left = false;
                  game.input.right = false;
                  Scene_Check_Scene(Stage_Datas[Stage]);
                }
              }
              else{
                if(Image[Images_Data.人].x > 1600 - Image[Images_Data.人].width){
                  Image[Images_Data.人].x = 1600 - Image[Images_Data.人].width;
                }
              }
              if(Datas.移動データ.左){
                if(Image[Images_Data.人].x <= -Image[Images_Data.人].width){
                  if(Datas.移動データ.左x) Character_X = Datas.移動データ.左x;
                  else Character_X = "右端";
                  if(Datas.移動データ.左ステージx) Stage_X = Datas.移動データ.左ステージx;
                  else Stage_X = "右端";
                  if(Datas.移動データ.左ステージy) Stage_Y = Datas.移動データ.左ステージy;
                  else Stage_Y = 0;
                  if(Datas.移動データ.左向き) Character_direction = Datas.移動データ.左向き;
                  Stage = Datas.移動データ.左;
                  Key_z = false;
                  Key_x = false;
                  Key_c = false;
                  game.input.up = false;
                  game.input.down = false;
                  game.input.left = false;
                  game.input.right = false;
                  Scene_Check_Scene(Stage_Datas[Stage]);
                }
              }
              else{
                if(Image[Images_Data.人].x < 0){
                  Image[Images_Data.人].x = 0;
                }
              }
              if(Datas.移動データ.上){
                if(Image[Images_Data.人].y <= -Image[Images_Data.人].height){
                  if(Datas.移動データ.上x!=undefined) Character_X = Datas.移動データ.上x;
                  if(Datas.移動データ.上向き) Character_direction = Datas.移動データ.上向き;
                  Stage = Datas.移動データ.上;
                  Key_z = false;
                  Key_x = false;
                  Key_c = false;
                  game.input.up = false;
                  game.input.down = false;
                  game.input.left = false;
                  game.input.right = false;
                  Scene_Check_Scene(Stage_Datas[Stage]);
                }
              }
            }
            else{
            if(Image[Images_Data.人].x < 0){
              Image[Images_Data.人].x = 0;
            }
            if(Image[Images_Data.人].x > 1600 - Image[Images_Data.人].width){
              Image[Images_Data.人].x = 1600 - Image[Images_Data.人].width;
            }
          };
            if(HTML == "編集"){
              Image_atarihantei[Images_Data.人].x = Image[Images_Data.人].x;
              Image_atarihantei[Images_Data.人].y = Image[Images_Data.人].y
            };
            Character_X = Image[Images_Data.人].x;
            Character_Y = Image[Images_Data.人].y;
          };
          pad_keydown();
        };
      });

      var Pad1 = new Pad("image/pad.png",500);
      if(HTML == "編集") Pad1.y = height/2-500;
      else Pad1.y = height-500;
      Pad1.opacity = Pad_opacity;
      scene.addChild(Pad1);

      var X_B = new Sprite();
      X_B._element = document.createElement("img");
      X_B._element.src = "image/x.png";
      X_B.width = 250;
      X_B.height = 250;
      X_B.x = width - 250;
      X_B.y = height - 500;
      if(HTML == "編集") X_B.y = height/2-500;
      else X_B.y = height-500;
      X_B.opacity = Pad_opacity;
      scene.addChild(X_B);

      var C_B = new Sprite();
      C_B._element = document.createElement("img");
      C_B._element.src = "image/c.png";
      C_B.width = 250;
      C_B.height = 250;
      C_B.x = width - 250;
      if(HTML == "編集") C_B.y = height/2 - 250;
      else C_B.y = height - 250;
      C_B.opacity = Pad_opacity;
      scene.addChild(C_B);

      var Z_B = new Sprite();
      Z_B._element = document.createElement("img");
      Z_B._element.src = "image/z.png";
      Z_B.width = 250;
      Z_B.height = 250;
      Z_B.x = width - 500;
      if(HTML == "編集") Z_B.y = height/2 - 250;
      else Z_B.y = height - 250;
      Z_B.opacity = Pad_opacity;
      scene.addChild(Z_B);

      X_B.addEventListener("touchstart",function(){
        Key_x = true;
        X_B._element.src = "image/x_down.png";
        return;
      });

      X_B.addEventListener("touchend",function(){
        Key_x = false;
        X_B._element.src = "image/x.png";
        return;
      });

      C_B.addEventListener("touchstart",function(){
        Key_c = true;
        C_B._element.src = "image/c_down.png";
        return;
      });

      C_B.addEventListener("touchend",function(){
        Key_c = false;
        C_B._element.src = "image/c.png";
        return;
      });

      Z_B.addEventListener("touchstart",function(){
        Key_z = true;
        Z_B._element.src = "image/z_down.png";
        return;
      });

      Z_B.addEventListener("touchend",function(){
        Key_z = false;
        Z_B._element.src = "image/z.png";
        return;
      });

      function pad_keydown(){
        Pad1._element.src = "image/pad.png";
        if(game.input.up){
          Pad1.rotation = 0;
          Pad1._element.src = "image/pad_keydown.png";
        }
        if(game.input.down){
          Pad1.rotation = 180;
          Pad1._element.src = "image/pad_keydown.png";
        }
        if(game.input.right){
          Pad1.rotation = 90;
          Pad1._element.src = "image/pad_keydown.png";
        }
        if(game.input.left){
          Pad1.rotation = 270;
          Pad1._element.src = "image/pad_keydown.png";
        }
        return;
      };

      if(HTML == "編集"){

        var Ui_Button = [];
        var Haiti_mood = false;
        var Hensyu_mood = false;
        var Human_image_add_mood = false;
        var Haiti_image_x;
        var Haiti_image_y;
        var Inputs = [];

        function Input(x,y,w,h,v,p){
          Inputs[Inputs.length] = new Entity();
          Inputs[Inputs.length-1].moveTo(x,y+900);
          Inputs[Inputs.length-1].width = w;
          Inputs[Inputs.length-1].height = h;
          Inputs[Inputs.length-1]._element = document.createElement("textarea");
          Inputs[Inputs.length-1]._style["font-size"] = 60;
          Inputs[Inputs.length-1]._element.value = v;
          Inputs[Inputs.length-1]._element.placeholder = p;
        };

        Input(width/4*0,height/10*0,width/4,height/10,"人","配置オブジェクトの名称");
        Input(width/4*1,height/10*0,width/4,height/10,"","配置オブジェクトの画像URL");
        Input(width/4*0,height/10*0,width/4,height/10,"","");
        Input(width/4*0,height/10*1,width/4,height/10,"","人の歩き左画像");
        Input(width/4*0,height/10*2,width/4,height/10,"","人の走り左画像");
        Input(width/4*0,height/10*3,width/4,height/10,"","人の空中左画像");
        Input(width/4*1,height/10*0,width/4,height/10,"","人の停止右画像");
        Input(width/4*1,height/10*1,width/4,height/10,"","人の歩き右画像");
        Input(width/4*1,height/10*2,width/4,height/10,"","人の走り右画像");
        Input(width/4*1,height/10*3,width/4,height/10,"","人の空中右画像");
        Input(width/4*0,height/10*0,width/4,height/10,"","変更後の画像URL");
        Input(width/4*1,height/10*0,width/4,height/10,"","変更後のx座標");
        Input(width/4*1,height/10*1,width/4,height/10,"","変更後のy座標");
        Input(width/4*1,height/10*2,width/4,height/10,"","変更後の幅");
        Input(width/4*1,height/10*3,width/4,height/10,"","変更後の高さ");
        Input(width/4*1,height/10*4,width/4,height/10,"","変更後の初期透明度");
        Input(width/4*0,height/10*0,width/4,height/10,"","左への移動");
        Input(width/4*1,height/10*0,width/4,height/10,"","右への移動");
        Input(width/4*2,height/10*0,width/4,height/10,"","上への移動");
        Input(width/4*0,height/10*1,width/4,height/10,"","左への移動後のx");
        Input(width/4*1,height/10*1,width/4,height/10,"","右への移動後のx");
        Input(width/4*2,height/10*1,width/4,height/10,"","上への移動後のx");
        Input(width/4*0,height/10*2,width/4,height/10,"","左への移動後の向き");
        Input(width/4*1,height/10*2,width/4,height/10,"","右への移動後の向き");
        Input(width/4*2,height/10*2,width/4,height/10,"","上への移動後の向き");
        Input(width/4*0,height/10*1,width/4,height/10,"","BGMのURL");
        Input(width/4*1,height/10*1,width/4,height/10,"","BGMのループ開始箇所");
        Input(width/4*0,height/10*2,width/4,height/10,"","重力");
        Input(width/4*1,height/10*2,width/4,height/10,"","摩擦");
        Input(width/4*2,height/10*2,width/4,height/10,"","地面の高さ");
        Input(width/4*0,height/10*3,width/4,height/10,"","ジャンプ力");
        Input(width/4*1,height/10*3,width/4,height/10,"","ジャンプ回数");
        Input(width/4*2,height/10*3,width/4,height/10,"","ジャンプ音のURL");
        Input(width/4*3,height/10*3,width/4,height/10,"","ジャンプ時の回転角度");
        Input(width/4*1,height/10*1,width/4,height/10,"","変化するデータ");
        Input(width/4*1,height/10*2,width/4,height/10,"","接触時");
        Input(width/4*1,height/10*3,width/4,height/10,"","非接触時");
        Input(width/4*3,height/10*1,width/4,height/10,"","値");
        Input(width/4*2,height/10*1,width/4,height/10,"","ステージ幅");
        Input(width/4*3,height/10*1,width/4,height/10,"","ステージ高さ");
        Input(width/4*0,height/10*3,width/4,height/10,"","左への移動後のステージX");
        Input(width/4*1,height/10*3,width/4,height/10,"","右への移動後のステージX");
        Input(width/4*2,height/10*3,width/4,height/10,"","上への移動後のステージX");
        Input(width/4*0,height/10*4,width/4,height/10,"","左への移動後のステージY");
        Input(width/4*1,height/10*4,width/4,height/10,"","右への移動後のステージY");
        Input(width/4*2,height/10*4,width/4,height/10,"","上への移動後のステージY");
        console.log(Inputs.length);

        var Pull_down1 = new Entity();
        Pull_down1.moveTo(0,height/10*1+900);
        Pull_down1.width = width/4;
        Pull_down1.height = height/10;
        Pull_down1._element = document.createElement("select");
        Pull_down1._style["font-size"] = 60;
        var Option1 = [];
        for (var k = 0; k < Image.length; k++){
          Option1[k] = document.createElement("option");
          Option1[k].text =  Image[k].name;
          Option1[k].value = Image[k].name;
          Pull_down1._element.appendChild(Option1[k]);
        };

        var Pull_down2 = new Entity();
        Pull_down2.moveTo(width/4*1,height/10*0+900);
        Pull_down2.width = width/4;
        Pull_down2.height = height/10;
        Pull_down2._element = document.createElement("select");
        Pull_down2._style["font-size"] = 60;
        var Option2 = [];
        for (var k = 0; k < Image.length; k++){
          Option2[k] = document.createElement("option");
          Option2[k].text =  Image[k].name;
          Option2[k].value = Image[k].name;
          Pull_down2._element.appendChild(Option2[k]);
        };

        var Pull_down3 = new Entity();
        Pull_down3.moveTo(width/4*1,height/10*0+900);
        Pull_down3.width = width/4;
        Pull_down3.height = height/10;
        Pull_down3._element = document.createElement("select");
        Pull_down3._style["font-size"] = 60;
        var Option3 = [];
        for (var k = 1; k < 9; k++){
          Option3[k] = document.createElement("option");
          switch(k){
            case 1:
              Option3[k].text =  "右";
              Option3[k].value = "右";
              break;
            case 2:
              Option3[k].text =  "左";
              Option3[k].value = "左";
              break;
            case 3:
              Option3[k].text =  "歩右";
              Option3[k].value = "歩右";
              break;
            case 4:
              Option3[k].text =  "歩左";
              Option3[k].value = "歩左";
              break;
            case 5:
              Option3[k].text =  "走右";
              Option3[k].value = "走右";
              break;
            case 6:
              Option3[k].text =  "走左";
              Option3[k].value = "走左";
              break;
            case 7:
              Option3[k].text =  "空中右";
              Option3[k].value = "空中右";
              break;
            case 8:
              Option3[k].text =  "空中左";
              Option3[k].value = "空中左";
              break;
          };
          Pull_down3._element.appendChild(Option3[k]);
        };

        var Pull_down4 = new Entity();
        Pull_down4.moveTo(width/4*1,height/10*1+900);
        Pull_down4.width = width/4;
        Pull_down4.height = height/10;
        Pull_down4._element = document.createElement("select");
        Pull_down4._style["font-size"] = 60;
        var Option4 = [];
        for (var k = 1; k < 4; k++){
          Option4[k] = document.createElement("option");
          switch(k){
            case 1:
              Option4[k].text =  "Cキー";
              Option4[k].value = "cキー";
              break;
            case 2:
              Option4[k].text =  "上キー";
              Option4[k].value = "上キー";
              break;
            case 3:
              Option4[k].text =  "下キー";
              Option4[k].value = "下キー";
              break;
          };
          Pull_down4._element.appendChild(Option4[k]);
        };

        var Pull_down5 = new Entity();
        Pull_down5.moveTo(0,height/10*1+900);
        Pull_down5.width = width/4;
        Pull_down5.height = height/10;
        Pull_down5._element = document.createElement("select");
        Pull_down5._style["font-size"] = 60;
        var Option5 = [];
        var Option = document.createElement("option");
        Pull_down5._element.appendChild(Option);
        Pull_down5._element.appendChild(Option);
        for (var k = 0; k < Image.length; k++){
          Option5[k] = document.createElement("option");
          Option5[k].text =  Image[k].name;
          Option5[k].value = Image[k].name;
          Pull_down5._element.appendChild(Option5[k]);
        };

        var Pull_down6 = new Entity();
        Pull_down6.moveTo(width/4*2,height/10*1+900);
        Pull_down6.width = width/4;
        Pull_down6.height = height/10;
        Pull_down6._element = document.createElement("select");
        Pull_down6._style["font-size"] = 60;
        var Option6 = [];
        for (var k = 0; k < 5; k++){
          Option6[k] = document.createElement("option");
          switch(k){
            case 1:
              Option6[k].text =  "Message";
              Option6[k].value = "text";
              break;
            case 2:
              Option6[k].text =  "ステージ移動";
              Option6[k].value = "ステージ移動";
              break;
            case 3:
              Option6[k].text =  "x";
              Option6[k].value = "x";
              break;
            case 4:
              Option6[k].text =  "向き";
              Option6[k].value = "向き";
              break;
          };
          Pull_down6._element.appendChild(Option6[k]);
        };

        function Buttons(x,y,a){
          Ui_Button[Ui_Button.length] = new Button(a,"light",width/4,height/10);
          Ui_Button[Ui_Button.length-1].moveTo(x,y);
          Ui_Button[Ui_Button.length-1]._style["font-size"] = height/20;
          scene.addChild(Ui_Button[Ui_Button.length-1]);
          Ui_Button[Ui_Button.length-1].addEventListener("touchstart",function(e){
            Pad_opacity = 0;
            Hensyu_mood = true;
            if(this.opacity==0) return;
            switch(this.text){
              case "物体":
                Object_mood = true;
                Button_C();
                Button_C(2,"削除する");
                Button_C(3,"変更する");
                scene.addChild(Pull_down1);
                Inputs[10]._element.value = Image[Images_Data[Pull_down1._element.value]].url;
                scene.addChild(Inputs[10]);
                Inputs[11]._element.value = Image[Images_Data[Pull_down1._element.value]].x + Stage_X;
                scene.addChild(Inputs[11]);
                Inputs[12]._element.value = Image[Images_Data[Pull_down1._element.value]].y - Stage_Y;
                scene.addChild(Inputs[12]);
                Inputs[13]._element.value = Image[Images_Data[Pull_down1._element.value]].width;
                scene.addChild(Inputs[13]);
                Inputs[14]._element.value = Image[Images_Data[Pull_down1._element.value]].height;
                scene.addChild(Inputs[14]);
                Inputs[15]._element.value = Image[Images_Data[Pull_down1._element.value]].opacity;
                scene.addChild(Inputs[15]);
                break;
              case "配置":
                Button_C();
                Haiti_mood = true;
                scene.addChild(Inputs[0]);
                scene.addChild(Inputs[1]);
                break;
              case "保存":
                window.localStorage.setItem("ローカルステージデータ",JSON.stringify(Stage_Datas));
                var URL = "https://script.google.com/macros/s/AKfycbzQm1rsU9qHfmOCRgPguLLifPIPc4Ip6NMbei5rX0EGu8-XfJj8/exec";
                var Options = {
                  method: "POST",
                  body:"編集" + JSON.stringify(Stage_Datas)
                };
                fetch(URL,Options).then(res => res.json()).then(result => {
                  Scene_Check_Scene(Stage_Datas[Stage]);
                  return;
                },);
                break;
              case "読み込み":
                if(window.localStorage.getItem("ローカルステージデータ")){
                  Stage_Datas = window.localStorage.getItem("ローカルステージデータ");
                  Stage_Datas = JSON.parse(Stage_Datas);
                }
                else{
                  Stage_Datas = {};
                  Stage = "最初";
                }
                Scene_Check_Scene(Stage_Datas[Stage]);
                return;
                break;
              case "設定":
                Button_C();
                Button_C(0,"人");
                Button_C(1,"物体");
                Button_C(2,"物理");
                Button_C(3,"移動");
                Button_C(4,"接触");
                Button_C(5,"ボタン");
                Button_C(6,"戻る");
                break;
              case "物理":
                Button_C();
                Button_C(3,"物理設定");
                if(Datas.設定){
                  if(Datas.設定.BGM) Inputs[25]._element.value = Datas.設定.BGM;
                  if(Datas.設定.BGMED) Inputs[26]._element.value = Datas.設定.BGMED;
                  if(Datas.設定.重力) Inputs[27]._element.value = Datas.設定.重力;
                  if(Datas.設定.摩擦) Inputs[28]._element.value = Datas.設定.摩擦;
                  if(Datas.設定.地面) Inputs[29]._element.value = Datas.設定.地面;
                  if(Datas.設定.ジャンプ力) Inputs[30]._element.value = Datas.設定.ジャンプ力;
                  if(Datas.設定.ジャンプ) Inputs[31]._element.value = Datas.設定.ジャンプ;
                  if(Datas.設定.ジャンプ音) Inputs[32]._element.value = Datas.設定.ジャンプ音;
                  if(Datas.設定.回転) Inputs[33]._element.value = Datas.設定.回転;
                  if(Datas.設定.ステージ幅) Inputs[38]._element.value = Datas.設定.ステージ幅;
                  if(Datas.設定.ステージ高さ) Inputs[39]._element.value = Datas.設定.ステージ高さ;
                }
                scene.addChild(Inputs[25]);
                scene.addChild(Inputs[26]);
                scene.addChild(Inputs[27]);
                scene.addChild(Inputs[28]);
                scene.addChild(Inputs[29]);
                scene.addChild(Inputs[30]);
                scene.addChild(Inputs[31]);
                scene.addChild(Inputs[32]);
                scene.addChild(Inputs[33]);
                scene.addChild(Inputs[38]);
                scene.addChild(Inputs[39]);
                break;
              case "物理設定":
                Datas.設定 = {
                  BGM:Inputs[25]._element.value,
                  BGMED:Inputs[26]._element.value*1,
                  重力:Inputs[27]._element.value*1,
                  摩擦:Inputs[28]._element.value*1,
                  地面:Inputs[29]._element.value*1,
                  ジャンプ力:Inputs[30]._element.value*1,
                  ジャンプ:Inputs[31]._element.value*1,
                  ジャンプ音:Inputs[32]._element.value,
                  回転:Inputs[33]._element.value*1,
                  ステージ幅:Inputs[38]._element.value*1,
                  ステージ高さ:Inputs[39]._element.value*1
                };
                if(Datas.設定.BGM=="") delete Datas.設定.BGM;
                if(Datas.設定.BGMED=="") delete Datas.設定.BGMED;
                if(Datas.設定.重力=="") delete Datas.設定.重力;
                if(Datas.設定.摩擦=="") delete Datas.設定.摩擦;
                if(Datas.設定.地面=="") delete Datas.設定.地面;
                if(Datas.設定.ジャンプ力=="") delete Datas.設定.ジャンプ力;
                if(Datas.設定.ジャンプ=="") delete Datas.設定.ジャンプ;
                if(Datas.設定.ジャンプ音=="") delete Datas.設定.ジャンプ音;
                if(Datas.設定.回転=="") delete Datas.設定.回転;
                if(Datas.設定.ステージ幅=="") delete Datas.設定.ステージ幅;
                if(Datas.設定.ステージ高さ=="") delete Datas.設定.ステージ高さ;
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                break;
              case "移動設定":
                Datas.移動データ = {
                  左:Inputs[16]._element.value,
                  右:Inputs[17]._element.value,
                  上:Inputs[18]._element.value,
                  左x:Inputs[19]._element.value*1,
                  右x:Inputs[20]._element.value*1,
                  上x:Inputs[21]._element.value*1,
                  左向き:Inputs[22]._element.value,
                  右向き:Inputs[23]._element.value,
                  上向き:Inputs[24]._element.value,
                  上向き:Inputs[24]._element.value,
                  左ステージx:Inputs[40]._element.value*1,
                  右ステージx:Inputs[41]._element.value*1,
                  上ステージx:Inputs[42]._element.value*1,
                  左ステージy:Inputs[43]._element.value*1,
                  右ステージy:Inputs[44]._element.value*1,
                  上ステージy:Inputs[45]._element.value*1,
                };
                if(Datas.移動データ.左=="") delete Datas.移動データ.左;
                if(Datas.移動データ.右=="") delete Datas.移動データ.右;
                if(Datas.移動データ.上=="") delete Datas.移動データ.上;
                if(Inputs[19]._element.value=="") delete Datas.移動データ.左x;
                if(Inputs[20]._element.value=="") delete Datas.移動データ.右x;
                if(Inputs[21]._element.value=="") delete Datas.移動データ.上x;
                if(Datas.移動データ.左向き=="") delete Datas.移動データ.左向き;
                if(Datas.移動データ.右向き=="") delete Datas.移動データ.右向き;
                if(Datas.移動データ.上向き=="") delete Datas.移動データ.上向き;
                if(Inputs[40]._element.value=="") delete Datas.移動データ.左ステージx;
                if(Inputs[41]._element.value=="") delete Datas.移動データ.右ステージx;
                if(Inputs[42]._element.value=="") delete Datas.移動データ.上ステージx;
                if(Inputs[43]._element.value=="") delete Datas.移動データ.左ステージy;
                if(Inputs[44]._element.value=="") delete Datas.移動データ.右ステージy;
                if(Inputs[45]._element.value=="") delete Datas.移動データ.上ステージy;
                console.log(Datas.移動データ);
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                break;
              case "移動":
                Button_C();
                Button_C(3,"移動設定");
                if(Datas.移動データ){
                  if(Datas.移動データ.左!=undefined) Inputs[16]._element.value = Datas.移動データ.左;
                  if(Datas.移動データ.右!=undefined) Inputs[17]._element.value = Datas.移動データ.右;
                  if(Datas.移動データ.上!=undefined) Inputs[18]._element.value = Datas.移動データ.上;
                  if(Datas.移動データ.左x!=undefined) Inputs[19]._element.value = Datas.移動データ.左x;
                  if(Datas.移動データ.右x!=undefined) Inputs[20]._element.value = Datas.移動データ.右x;
                  if(Datas.移動データ.上x!=undefined) Inputs[21]._element.value = Datas.移動データ.上x;
                  if(Datas.移動データ.左向き!=undefined) Inputs[22]._element.value = Datas.移動データ.左向き;
                  if(Datas.移動データ.右向き!=undefined) Inputs[23]._element.value = Datas.移動データ.右向き;
                  if(Datas.移動データ.上向き!=undefined) Inputs[24]._element.value = Datas.移動データ.上向き;
                  if(Datas.移動データ.左ステージx!=undefined) Inputs[40]._element.value = Datas.移動データ.左ステージx;
                  if(Datas.移動データ.右ステージx!=undefined) Inputs[41]._element.value = Datas.移動データ.右ステージx;
                  if(Datas.移動データ.上ステージx!=undefined) Inputs[42]._element.value = Datas.移動データ.上ステージx;
                  if(Datas.移動データ.左ステージy!=undefined) Inputs[43]._element.value = Datas.移動データ.左ステージy;
                  if(Datas.移動データ.右ステージy!=undefined) Inputs[44]._element.value = Datas.移動データ.右ステージy;
                  if(Datas.移動データ.上ステージy!=undefined) Inputs[45]._element.value = Datas.移動データ.上ステージy;
                }
                scene.addChild(Inputs[16]);
                scene.addChild(Inputs[17]);
                scene.addChild(Inputs[18]);
                scene.addChild(Inputs[19]);
                scene.addChild(Inputs[20]);
                scene.addChild(Inputs[21]);
                scene.addChild(Inputs[22]);
                scene.addChild(Inputs[23]);
                scene.addChild(Inputs[24]);
                scene.addChild(Inputs[40]);
                scene.addChild(Inputs[41]);
                scene.addChild(Inputs[42]);
                scene.addChild(Inputs[43]);
                scene.addChild(Inputs[44]);
                scene.addChild(Inputs[45]);
                break;
              case "戻る":
                Button_C();
                Button_C(0,"配置");
                Button_C(1,"保存");
                Button_C(2,"読み込み");
                Button_C(3,"設定");
                break;
              case "登録":
                window.localStorage.setItem("ローカル人データ",JSON.stringify(Datas.人));
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                break;
              case "貼り付け":
                if(window.localStorage.getItem("ローカル人データ")){
                  Datas.人 = window.localStorage.getItem("ローカル人データ");
                  Datas.人 = JSON.parse(Datas.人);
                }
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                break;
              case "全削除":
                delete Datas[Pull_down4._element.value];
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                return;
                break;
              case "キー追加":
                if(Datas[Pull_down4._element.value]){
                  var Add_page = Object.keys(Datas[Pull_down4._element.value]).length+1;
                  Datas[Pull_down4._element.value][Add_page] = {};
                  switch(Pull_down6._element.value){
                    case "":
                      Datas[Pull_down4._element.value][Add_page] = Inputs[37]._element.value;
                      break;
                    default:
                      Datas[Pull_down4._element.value][Add_page][Pull_down6._element.value] = Inputs[37]._element.value;
                      break;
                  };
                  if(Pull_down5._element.value){
                    Datas[Pull_down4._element.value][Add_page]["1"] = {接触:Pull_down5._element.value};
                  };
                }
                else{
                  Datas[Pull_down4._element.value] = {1:{}};
                  switch(Pull_down6._element.value){
                    default:
                      Datas[Pull_down4._element.value]["1"][Pull_down6._element.value] = Inputs[37]._element.value;
                      break;
                  };
                  if(Pull_down5._element.value){
                    Datas[Pull_down4._element.value]["1"]["1"] = {接触:Pull_down5._element.value};
                  };
                };
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                break;
              case "ボタン":
                Button_C();
                Button_C(2,"全削除");
                Button_C(3,"キー追加");
                scene.addChild(Inputs[37]);
                scene.addChild(Pull_down4);
                scene.addChild(Pull_down5);
                scene.addChild(Pull_down6);
                break;
              case "人":
                Human_image_add_mood = true;
                Button_C();
                Button_C(2,"減らす");
                Button_C(3,"追加");
                Button_C(4,"登録");
                Button_C(5,"貼り付け");
                Button_C(6,"他確認");
                scene.addChild(Inputs[2]);
                scene.addChild(Pull_down3);
                break;
              case "減らす":
                if(Object.keys(Datas.人[Pull_down3._element.value]).length==1){
                  delete Datas.人[Pull_down3._element.value];
                }
                else delete Datas.人[Pull_down3._element.value][Object.keys(Datas.人[Pull_down3._element.value]).length];
                Human_set(false);
                break;
              case "終了":
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                break;
              case "追加":
                var Add_page = Pull_down3._element.value;
                if(Datas.人){
                  if(Datas.人[Add_page]) Datas.人[Add_page][Object.keys(Datas.人[Add_page]).length+1] = Inputs[2]._element.value;
                  else Datas.人[Add_page] = {1:Inputs[2]._element.value};
                }
                else{
                  Datas.人 = {};
                  Datas.人[Add_page] = {1:Inputs[2]._element.value}
                }
                Human_set(false);
                break;
              case "決定":
                Datas.人 = {
                  左:{1:Inputs[2]._element.value},
                  歩左:{1:Inputs[3]._element.value},
                  走左:{1:Inputs[4]._element.value},
                  空中左:{1:Inputs[5]._element.value},
                  右:{1:Inputs[6]._element.value},
                  歩右:{1:Inputs[7]._element.value},
                  走右:{1:Inputs[8]._element.value},
                  空中右:{1:Inputs[9]._element.value}
                };
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                return;
                break;
              case "変更する":
                if(Change_object){
                  Datas.画像[Change_object].src = Inputs[10]._element.value;
                  Datas.画像[Change_object].x = Inputs[11]._element.value*1;
                  Datas.画像[Change_object].y = Inputs[12]._element.value*1;
                  Datas.画像[Change_object].width = Inputs[13]._element.value*1;
                  Datas.画像[Change_object].height = Inputs[14]._element.value*1;
                  if(Inputs[15]._element.value != ""){
                    if(Inputs[15]._element.value != 1) Datas.画像[Change_object].opacity = Inputs[15]._element.value*1;
                    else delete Datas.画像[Change_object].opacity;
                  }
                  else delete Datas.画像[Change_object].opacity;
                  Stage_Datas[Stage] = Datas;
                  Scene_Check_Scene(Stage_Datas[Stage]);
                  return;
                }
                break;
              case "削除する":
                if(Change_object){
                  delete Datas.画像[Change_object];
                  Stage_Datas[Stage] = Datas;
                  Scene_Check_Scene(Stage_Datas[Stage]);
                  return;
                }
                break;
              case "全部削除":
                delete Datas.接触;
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                return;
                break;
              case "他確認":
                switch(Image[Images_Data.人].状態){
                  case "停止":
                    Run = false;
                    Z_Run = false;
                    State_change("動");
                    break;
                  case "動":
                    if(Run||Z_Run){
                      State_change("空中");
                    }
                    else Z_Run = true;
                    break;
                  case "空中":
                    State_change("停止");
                    if(Character_direction=="右"){
                      Character_direction = "左";
                    }
                    else Character_direction = "右";
                    break;
                };
                Human_set(false);
                break;
              case "追加する":
                var aaa = 1;
                var True_value = Inputs[35]._element.value;
                var False_value = Inputs[36]._element.value;
                switch(Inputs[34]._element.value){
                  case "透明度":
                    Inputs[34]._element.value = "opacity";
                    break;
                  case "縦加速度":
                    if(True_value!=""){
                      if(True_value[0]!="-") True_value = "-" + True_value;
                    }
                    if(False_value!=""){
                      if(False_value[0]!="-") False_value = "-" + False_value;
                    }
                    break;
                }
                if(Datas.接触) aaa = Object.keys(Datas.接触).length+1;
                else Datas.接触 = {};
                Datas.接触[aaa] = {
                  接触:Pull_down1._element.value,
                  対象:Pull_down2._element.value,
                  データ:Inputs[34]._element.value,
                  真値:True_value*1,
                  偽値:False_value*1
                }
                if(True_value=="") delete Datas.接触[aaa].真値;
                else{
                  if(True_value.match(/[^-\d]/)){
                    Datas.接触[aaa].真値 = True_value;
                  }
                }
                if(False_value=="") delete Datas.接触[aaa].偽値;
                else{
                  if(False_value.match(/[^-\d]/)){
                    Datas.接触[aaa].偽値 = False_value;
                  }
                }
                Datas.接触[aaa] = JSON.stringify(Datas.接触[aaa]);
                Datas.接触[aaa] = JSON.parse(Datas.接触[aaa]);
                Stage_Datas[Stage] = Datas;
                Scene_Check_Scene(Stage_Datas[Stage]);
                return;
                break;
              case "接触":
                Object_mood = true;
                Button_C();
                Button_C(2,"全部削除");
                Button_C(3,"追加する");
                scene.addChild(Pull_down1);
                scene.addChild(Pull_down2);
                scene.addChild(Inputs[34]);
                scene.addChild(Inputs[35]);
                scene.addChild(Inputs[36]);
                break;
            };
          });
        };

        Buttons(width/4*0,height/10*0 + 900,"配置");
        Buttons(width/4*1,height/10*0 + 900,"保存");
        Buttons(width/4*2,height/10*0 + 900,"読み込み");
        Buttons(width/4*3,height/10*0 + 900,"設定");
        Buttons(width/4*0,height/10*1 + 900,"");
        Buttons(width/4*1,height/10*1 + 900,"");
        Buttons(width/4*2,height/10*1 + 900,"");
        Buttons(width/4*3,height/10*1 + 900,"");
        Buttons(width/4*3,height/10*4 + 900,"終了");
        Ui_Button[4].opacity = 0;
        Ui_Button[5].opacity = 0;
        Ui_Button[6].opacity = 0;
        Ui_Button[7].opacity = 0;
      };

      function Button_C(a,b){
        switch(a){
          case undefined:
            for (var i = 0; i < Ui_Button.length-1; i++) {
              Ui_Button[i].text = "";
              Ui_Button[i].opacity = 0;
            }
            break;
          default:
            Ui_Button[a].text = b;
            Ui_Button[a].opacity = 1;
            break;
        }
        return;
      };

      return scene;
    };
    var Map_Scene = function(Datas){

      var scene = new Scene();

      Map = [];

      for (var i = 0; i < 18; i++) {
        Map[i] = [];
        for (var j = 0; j < 21; j++) {
          Map[i][j] = 0;
        };
      };

      Map = Datas.map;

      console.log(JSON.stringify(Map));

      var scene = new Scene();

      var Image = [];
      var Images_Data = [];
      var i = 0;

      function Images(w,h,x,y,a,b){
        Image[i] = new Sprite();
        Image[i]._element = document.createElement("img");
        if(a) Image[i]._element.src = a;
        else Image[i]._element.src = "image/透明.png";
        Image[i].width = w;
        Image[i].height = h;
        Image[i].x = x;
        Image[i].y = y;
        Image[i].name = b;
        Images_Data[b] = i;
        scene.addChild(Image[i]);
        i++;
        return;
      };

      var Map_X = null;
      var Map_Y = null;

      var Run = 5;
      var Move = 0;
      var Map_W = Map[0].length;
      var Map_H = Map.length;
      var Check_X = null;
      var Check_Y = null;
      var Human = {};
      var Touch = true;

      Human.images = Stage_Datas[Datas.人];

      for (var I = 0; I < Datas.images.length; I++) {
        if(Datas.images[I].name=="人"){
          Images(100,100,1600/2-50,900/2-50,"image/透明.png",Datas.images[I].name);
          Human.向き = Character_direction;
          Human.上 = Human.images.上;
          Human.下 = Human.images.下;
          Human.左 = Human.images.左;
          Human.右 = Human.images.右;
          Human.歩上 = Human.images.歩上;
          Human.歩下 = Human.images.歩下;
          Human.歩左 = Human.images.歩左;
          Human.歩右 = Human.images.歩右;
          Human.走上 = Human.images.走上;
          Human.走下 = Human.images.走下;
          Human.走左 = Human.images.走左;
          Human.走右 = Human.images.走右;
          Human.Number = 0;
          Image[Images_Data["人"]]._element.src = Human[Character_direction][Human.Number];
        }
        else{
          Images(Map_W*100,Map_H*100,0,0,Datas.images[I].src,Datas.images[I].name);
          Image[Images_Data[Datas.images[I].name]].Mapx = 0;
          Image[Images_Data[Datas.images[I].name]].Mapy = 0;
        };
      };

      console.log(Datas);

      for(var I = 0; I < Map.length; I++){
        for(var J = 0; J < Map[I].length; J++){
          if(Map[I][J].type=="オブジェ"){
            Images(100,100,(J+8)*100-50,(I+4)*100,Map[I][J].image,Map[I][J].name);
            if(Map[I][J].images){
              Image[Images_Data[Map[I][J].name]].images = Stage_Datas[Map[I][J].images];
              Image[Images_Data[Map[I][J].name]].Move = 0;
              Image[Images_Data[Map[I][J].name]].Number = 0;
              Image[Images_Data[Map[I][J].name]].向き = Map[I][J].向き;
              Image[Images_Data[Map[I][J].name]].上 = Image[Images_Data[Map[I][J].name]].images.上;
              Image[Images_Data[Map[I][J].name]].下 = Image[Images_Data[Map[I][J].name]].images.下;
              Image[Images_Data[Map[I][J].name]].左 = Image[Images_Data[Map[I][J].name]].images.左;
              Image[Images_Data[Map[I][J].name]].右 = Image[Images_Data[Map[I][J].name]].images.右;
              Image[Images_Data[Map[I][J].name]].歩上 = Image[Images_Data[Map[I][J].name]].images.歩上;
              Image[Images_Data[Map[I][J].name]].歩下 = Image[Images_Data[Map[I][J].name]].images.歩下;
              Image[Images_Data[Map[I][J].name]].歩左 = Image[Images_Data[Map[I][J].name]].images.歩左;
              Image[Images_Data[Map[I][J].name]].歩右 = Image[Images_Data[Map[I][J].name]].images.歩右;
              if(Map[I][J].moves){
                Image[Images_Data[Map[I][J].name]].moves_number = 0;
                Image[Images_Data[Map[I][J].name]].moves = Map[I][J].moves;
                Image[Images_Data[Map[I][J].name]].time = 0;
                if(Map[I][J].times) Image[Images_Data[Map[I][J].name]].times = Map[I][J].times;
                else Image[Images_Data[Map[I][J].name]].times = 10;
              };
            };
            Image[Images_Data[Map[I][J].name]].Mapx = J;
            Image[Images_Data[Map[I][J].name]].Mapy = I;
            Image[Images_Data[Map[I][J].name]]._element.src = Image[Images_Data[Map[I][J].name]][Image[Images_Data[Map[I][J].name]].向き][0];
          };
          if(Map[I][J] == "動") Map[I][J] = "□";
        };
      };

      Map_X = Character_X;
      Map_Y = Character_Y;

      for(var i = 0; i < Image.length; i++){
        if(Image[i].name!="人"){
          Image[i].x = (Image[i].Mapx + 8) * 100-50 - Map_X * 100;
          Image[i].y = (Image[i].Mapy + 4) * 100 - Map_Y * 100;
        };
      };

      var Blackout = new Sprite();
      Blackout._element = document.createElement("img");
      Blackout._element.src = "image/黒.png";
      Blackout.width = width;
      Blackout.height = height;
      Blackout.tl.fadeOut(10);
      scene.addChild(Blackout);

      scene.addEventListener("enterframe",function(){

        if(Blackout.opacity==0){

          switch(Human.向き){
            case "上":
              Check_X = Map_X;
              Check_Y = Map_Y - 1;
              break;
            case "下":
              Check_X = Map_X;
              Check_Y = Map_Y + 1;
              break;
            case "左":
              Check_X = Map_X - 1;
              Check_Y = Map_Y;
              break;
            case "右":
              Check_X = Map_X + 1;
              Check_Y = Map_Y;
              break;
          };

          for(var i = 0; i < Image.length; i++){
            if(Image[i].name!="人"){
              switch (Human.向き) {
                case "上":
                  Image[i].x = (Image[i].Mapx + 8) * 100-50 - Map_X * 100;
                  Image[i].y = (Image[i].Mapy + 4) * 100 - Map_Y * 100 - Move;
                  break;
                case "下":
                  Image[i].x = (Image[i].Mapx + 8) * 100-50 - Map_X * 100;
                  Image[i].y = (Image[i].Mapy + 4) * 100 - Map_Y * 100 + Move;
                  break;
                case "左":
                  Image[i].x = (Image[i].Mapx + 8) * 100-50 - Map_X * 100 - Move;
                  Image[i].y = (Image[i].Mapy + 4) * 100 - Map_Y * 100;
                  break;
                case "右":
                  Image[i].x = (Image[i].Mapx + 8) * 100-50 - Map_X * 100 + Move;
                  Image[i].y = (Image[i].Mapy + 4) * 100 - Map_Y * 100;
                  break;
              };
              if(Image[i].向き){
                switch (Image[i].向き) {
                  case "上":
                    Image[i].y += Image[i].Move;
                    break;
                  case "下":
                    Image[i].y -= Image[i].Move;
                    break;
                  case "左":
                    Image[i].x += Image[i].Move;
                    break;
                  case "右":
                    Image[i].x -= Image[i].Move;
                    break;
                };
                Image[i].Number++;
                if(Image[i].Move){
                  if(Image[i].Number >= Image[i]["歩" + Image[i].向き].length) Image[i].Number = 0;
                  Image[i]._element.src = Image[i]["歩" + Image[i].向き][Image[i].Number];
                }
                else{
                  if(Image[i].Number >= Image[i][Image[i].向き].length) Image[i].Number = 0;
                  Image[i]._element.src = Image[i][Image[i].向き][Image[i].Number];
                };
              };
            };
          };

          if(!Move&&!Touch){
            if(Map[Map_Y][Map_X].type=="接触"){
              Touch = true;
              game.input.up = false;
              game.input.down = false;
              game.input.left = false;
              game.input.right = false;
              Scene_Check_Scene(Stage_Datas[Map[Map_Y][Map_X].Datas]);
            };
          };

          Human.Number++;
          if(Move){
            if(Key_z){
              if(Human.Number >= Human["走" + Human.向き].length) Human.Number = 0;
              Image[Images_Data["人"]]._element.src = Human["走" + Human.向き][Human.Number];
            }
            else{
              if(Human.Number >= Human["歩" + Human.向き].length) Human.Number = 0;
              Image[Images_Data["人"]]._element.src = Human["歩" + Human.向き][Human.Number];
            };
          }
          else{
            if(Human.Number >= Human[Human.向き].length) Human.Number = 0;
            Image[Images_Data["人"]]._element.src = Human[Human.向き][Human.Number];
          };

          if(Key_c){
            if(!Move){
              if(Check_X < Map[0].length && Check_Y < Map.length && Check_X >= 0 && Check_Y >= 0 ){
                if(Map[Check_Y][Check_X].type=="調べる"||Map[Check_Y][Check_X].type=="オブジェ"){
                  if(Map[Check_Y][Check_X].name){
                    if(!Image[Images_Data[Map[Check_Y][Check_X].name]].Move){
                      switch(Human.向き){
                        case "上":
                          Image[Images_Data[Map[Check_Y][Check_X].name]].向き = "下";
                          Image[Images_Data[Map[Check_Y][Check_X].name]]._element.src = Image[Images_Data[Map[Check_Y][Check_X].name]]["下"][0];
                          break;
                        case "下":
                          Image[Images_Data[Map[Check_Y][Check_X].name]].向き = "上";
                          Image[Images_Data[Map[Check_Y][Check_X].name]]._element.src = Image[Images_Data[Map[Check_Y][Check_X].name]]["上"][0];
                          break;
                        case "左":
                          Image[Images_Data[Map[Check_Y][Check_X].name]].向き = "右";
                          Image[Images_Data[Map[Check_Y][Check_X].name]]._element.src = Image[Images_Data[Map[Check_Y][Check_X].name]]["右"][0];
                          break;
                        case "右":
                          Image[Images_Data[Map[Check_Y][Check_X].name]].向き = "左";
                          Image[Images_Data[Map[Check_Y][Check_X].name]]._element.src = Image[Images_Data[Map[Check_Y][Check_X].name]]["左"][0];
                          break;
                      };
                      Image[Images_Data[Map[Check_Y][Check_X].name]].stop = 2;
                      Scene_Check_Scene(Stage_Datas[Map[Check_Y][Check_X].Datas]);
                    };
                  }
                  else Scene_Check_Scene(Stage_Datas[Map[Check_Y][Check_X].Datas]);
                };
              }
              else console.log("マップ外");
            };
          };

          for(var i = 0; i < Image.length; i++){
            if(Image[i].Move){
              Image[i].Move -= 10;
              if(!Image[i].Move){
                Map[Image[i].Beforey][Image[i].Beforex] = "□";
              };
            };
          };

          if(Move){
            if(Key_z) Move -= 25;
            else Move -= 10;
            if(Move < 0) Move = 0;
          };

          if(Key_x){
            console.log(JSON.stringify(Map));
            if(Map[Map_Y][Map_X]!="■"){
              /*
              Images(100,100,(Map_X+8)*100-50,(Map_Y+4)*100,"image/配置.png","■");
              Image[Images_Data["■"]].Mapx = Map_X;
              Image[Images_Data["■"]].Mapy = Map_Y;
              Map[Map_Y][Map_X] = "■";
              */
            };
          };

          if(Move_box){
            for (var i = 0; i < Move_box.length; i++) {
              if(Move_box[i][0]=="人"){
                if(Move_human(Move_box[i][1],true)){
                  Move_box = null;
                  break;
                };
              };
            }
          }
          else{
            if(game.input.up&&!game.input.down&&!game.input.left&&!game.input.right) Move_human("上");
            if(!game.input.up&&game.input.down&&!game.input.left&&!game.input.right) Move_human("下");
            if(!game.input.up&&!game.input.down&&game.input.left&&!game.input.right) Move_human("左");
            if(!game.input.up&&!game.input.down&&!game.input.left&&game.input.right) Move_human("右");
          };

          for(var i = 0; i < Image.length; i++){
            if(Image[i].moves){
              Image[i].time++;
              if(Image[i].times==Image[i].time){
                Image[i].time = 0;
                Image[i].moves_number++;
                if(Image[i].moves_number >= Image[i].moves.length) Image[i].moves_number = 0;
                Move_Object(Image[i],Image[i].moves[Image[i].moves_number]);
              };
            };
          };
        };
      });

      function Move_human(Direction,Automatic){
        if(Move) return;
        if(!Touch&&Map[Map_Y][Map_X].type=="接触") return;
        Move = 100;
        if(!Automatic){
          if(Human.向き!=Direction){
            Move = 0;
            Human.向き = Direction;
            Human.Number = 0;
            Image[Images_Data["人"]]._element.src = Human[Direction][Human.Number];
            return;
          };
          if(Map[Check_Y][Check_X]=="■"||Map[Check_Y][Check_X]=="動"||Map[Check_Y][Check_X].type=="調べる"||Map[Check_Y][Check_X].type=="オブジェ"){
            Move = 0;
            return;
          };
        }
        else{
          Human.向き = Direction;
          Move_box_length++;
        };
        Touch = false;
        switch(Direction){
          case "上":
            Map_Y--;
            break;
          case "下":
            Map_Y++;
            break;
          case "左":
            Map_X--;
            break;
          case "右":
            Map_X++;
            break;
        };
        if(Automatic) if(Move_box_length==Move_box.length) return(true);
        return(false);
      };

      function Move_Object(Object,Direction){
        if(Object.stop){
          Object.stop--;
          return;
        };
        if(Direction=="ランダム"){
          switch (Math.floor(Math.random()*8)){
            case 0:
              Direction = "上";
              break;
            case 1:
              Direction = "下";
              break;
            case 2:
              Direction = "左";
              break;
            case 3:
              Direction = "右";
              break;
            case 4:
              Direction = "上を向く";
              break;
            case 5:
              Direction = "下を向く";
              break;
            case 6:
              Direction = "左を向く";
              break;
            case 7:
              Direction = "右を向く";
              break;
          };
        };
        if(Direction=="ランダムに向く"){
          switch (Math.floor(Math.random()*4)){
            case 0:
              Direction = "上を向く";
              break;
            case 1:
              Direction = "下を向く";
              break;
            case 2:
              Direction = "左を向く";
              break;
            case 3:
              Direction = "右を向く";
              break;
          };
        };
        if(Direction=="ランダムに動く"){
          switch (Math.floor(Math.random()*4)){
            case 0:
              Direction = "上";
              break;
            case 1:
              Direction = "下";
              break;
            case 2:
              Direction = "左";
              break;
            case 3:
              Direction = "右";
              break;
          };
        };
        if(Direction=="近づく"){
          if(Map_X==Object.Check_X){
            if(Map_Y > Object.Check_Y) Direction = "下";
            else Direction = "上";
          }
          else{
            if(Map_X > Object.Check_X) Direction = "右";
            else Direction = "左";
          };

        };
        if(Object.Move) return;
        Object.Move = 100;
        if(Direction.substring(1)=="を向く"){
          Object.向き = Direction.substring(0,1);
          Object.Move = 0;
          Object.Number = 0;
          Object._element.src = Object[Direction.substring(0,1)][Object.Number];
          return;
        };
        Object.向き = Direction;
        switch (Direction) {
          case "上":
            Object.Check_X = Object.Mapx;
            Object.Check_Y = Object.Mapy - 1;
            break;
          case "下":
            Object.Check_X = Object.Mapx;
            Object.Check_Y = Object.Mapy + 1;
            break;
          case "左":
            Object.Check_X = Object.Mapx - 1;
            Object.Check_Y = Object.Mapy;
            break;
          case "右":
            Object.Check_X = Object.Mapx + 1;
            Object.Check_Y = Object.Mapy;
            break;
        };
        if(Map[Object.Check_Y][Object.Check_X]!="□"||(Map_X==Object.Check_X&&Map_Y==Object.Check_Y)){
          Object.Move = 0;
          return;
        };

        Map[Object.Check_Y][Object.Check_X] = Map[Object.Mapy][Object.Mapx];
        Map[Object.Mapy][Object.Mapx] = "動";
        Object.Beforex = Object.Mapx;
        Object.Beforey = Object.Mapy;
        Object.Mapx = Object.Check_X;
        Object.Mapy = Object.Check_Y;

        return;
      };

      return scene;
    };
    var Chat_Scene = function(Datas){

      var scene = new Scene();

      if(!Datas) Datas = {1:{"text":"存在しないデータ。"}};
      if(Change_Box){
        for (var i = 0; i < Change_Box.length; i++) {
          var Reg = new RegExp(Change_Box[i][0],"g");
          Datas = JSON.stringify(Datas);
          Datas = Datas.replace(Reg,Change_Box[i][1]);
          Datas = JSON.parse(Datas);
        };
      };
      var Kaigyo = 0;
      var Kaigyo_S = 0;
      var Match = null;
      for (var i = 0; i < Object.keys(Datas).length; i++) {
        if(Datas[Object.keys(Datas)[i]].text){
          Match = Datas[Object.keys(Datas)[i]].text.match(/●/g);
          if(Match){
            for(var k = 0; k < Match.length; k++){
            Kaigyo = Datas[Object.keys(Datas)[i]].text.indexOf("●");
            Kaigyo = Kaigyo%18;
            Kaigyo = 18 - Kaigyo;
            Kaigyo_S = "";
            for (var j = 0; j < Kaigyo; j++) {
              Kaigyo_S += " ";
            }
            Datas[Object.keys(Datas)[i]].text = Datas[Object.keys(Datas)[i]].text.replace(Match[k],Kaigyo_S);
          };
          };
        };
      };

      var i = 1;
      var Image = [];
      var Images_Data = {};
      var Cut = true;

      function Images(w,h,x,y,a,b){
        Image[i] = new Sprite();
        Image[i]._element = document.createElement("img");
        if(a) Image[i]._element.src = a;
        else Image[i]._element.src = "image/透明.png";
        Image[i].width = w;
        Image[i].height = h;
        Image[i].x = x;
        Image[i].y = y;
        Image[i].name = b;
        Images_Data[b] = i;
        scene.addChild(Image[i]);
        i++;
        return;
      }

      if(Datas.image){
        while(Datas.image[i]){
          Images(0,0,0,0,0,Datas.image[i].name);
        }
      }

      Images(width,height,0,0,"image/透明.png","背景");
      Images(width,400,0,480,"image/textbox.png","テキストボックス");
      if(HTML == "編集") Images(width,height/2,0,height/2,"image/白.png","白");
      Image[Images_Data.テキストボックス].opacity = 0.5;

      var Numbers = 450;

      function Texts(){
        if(i%18==0) Numbers += 62;
        Text[i] = new Sprite();
        Text[i]._element = document.createElement("innerHTML");
        Text[i]._style.font  = "60px monospace";
        Text[i]._style.color = "white";
        Text[i].x = 62 * (i%18) + 180;
        Text[i].y = Numbers;
        scene.addChild(Text[i]);
      }

      var ChoiceText = [];

      function Choice(Number){
        ChoiceText[Number] = new Sprite();
        ChoiceText[Number]._element = document.createElement("innerHTML");
        ChoiceText[Number]._style.font  = "60px monospace";
        ChoiceText[Number]._style.color = "white";
        ChoiceText[Number].x = 1000;
        ChoiceText[Number].y = 400 - Number * 90;
        ChoiceText[Number].opacity = 0;
        Images(600,80,ChoiceText[Number].x-20,ChoiceText[Number].y-10,"image/textbox.png","選択肢"+Number);
        scene.addChild(ChoiceText[Number]);
        Image[Images_Data["選択肢"+Number]].opacity = 0;
      }

      for(var i = 0; i < 90; i++) Texts();

      for(var j = 0; j < 5; j++) Choice(j);

      var k = 1;
      if(Datas[k].音) SE1.src = Datas[k].音;
      if(Datas[k].フラグ){
        if(!Flag[Datas[k].フラグ]) Flag[Datas[k].フラグ] = 0;
        if(Datas[k].増加量!=undefined) Flag[Datas[k].フラグ] += Datas[k].増加量;
        if(Datas[k].固定値!=undefined) Flag[Datas[k].フラグ] = Datas[k].固定値;
      };
      if(Datas[k].BGM){
        BGM.name1 = Datas[k].BGM;
        if(BGM.name1 != BGM.name2){
          BGM.src = BGM.name1;
          BGM.name2 = BGM.name1;
          if(BGM.src){
            if(BGM.paused) BGM.play();
            else BGM.currentTime = 0;
            if(Datas[k].BGMED) BGM.id = Datas[k].BGMED;
            else BGM.id = 0;
          }
        }
      };
      if(Datas[k].image){
        i = 1;
        while(Datas[k].image[i]){
          if(Datas[k].image[i].src){
            Image[Images_Data[Datas[k].image[i].name]]._element.src = Datas[k].image[i].src;
          }
          if(Datas[k].image[i].width){
            Image[Images_Data[Datas[k].image[i].name]].width = Datas[k].image[i].width;
          }
          if(Datas[k].image[i].height){
            Image[Images_Data[Datas[k].image[i].name]].height = Datas[k].image[i].height;
          }
          if(Datas[k].image[i].x){
            Image[Images_Data[Datas[k].image[i].name]].x = Datas[k].image[i].x;
          }
          if(Datas[k].image[i].y){
            Image[Images_Data[Datas[k].image[i].name]].y = Datas[k].image[i].y;
          }
          i++;
        }
      };
      if(Datas[k].text){
        if(Datas[k].text.indexOf(":")==-1) var Write = 1;
        else var Write = 2;
      }
      else Keydown_c();

      var Next = Datas[k].next;

      function Text_write(){
        while(Datas[k].text[i]==" ") i++;
        if(Datas[k].text[i]==":") Write = 1;
        Text[i]._element.textContent = Datas[k].text[i];
        i++;
        if(Datas[k].text[i]==undefined){
          if(Datas[k].選択肢) Write = "選択肢";
          else Write = false;
          COOLTime.c_key = 5;
        }
        if(Write==2) Text_write();
        if(SE1.src){
          if(SE1.paused) SE1.play();
          else SE1.currentTime = 0;
        }
        return;
      }

      i = 0;
      var C_N = null;

      scene.addEventListener("enterframe",function(){
        if(!Hensyu_mood){
          for(var c = 0; c < Object.keys(COOLTime).length; c++){
            if(COOLTime[Object.keys(COOLTime)[c]] > 0) COOLTime[Object.keys(COOLTime)[c]]--;
          };
          if(Write){
            if(Write=="選択肢"){
              Key_c = false;
              i = Image.length;
              for(var j = 0; j < Object.keys(Datas[k].選択肢).length; j++){
                ChoiceText[j]._element.textContent = Datas[k].選択肢[Object.keys(Datas[k].選択肢)[j]].text;
                ChoiceText[j].Number = j;
                ChoiceText[j].opacity = 1;
                ChoiceText[j].選択 = false;
                Image[Images_Data["選択肢"+j]].Number = j;
                Image[Images_Data["選択肢"+j]].next = Datas[k].選択肢[Object.keys(Datas[k].選択肢)[j]].next;
                Image[Images_Data["選択肢"+j]].text = ChoiceText[j]._element.textContent;
                Image[Images_Data["選択肢"+j]].opacity = 0.5;
              }
              ChoiceText[j-1].選択 = true;
              ChoiceText[j-1]._element.textContent = "▶ " + ChoiceText[j-1]._element.textContent;
              Next = Datas[k].選択肢[Object.keys(Datas[k].選択肢)[j-1]].next;
              C_N = j-1;
              Write = false;
            }
            else Text_write();
            if(Key_c && COOLTime.c_key == 0){
              COOLTime.c_key = 5;
              Write = 2;
            }
          }
          else{
            if(Datas[k].選択肢){
              if(game.input.down){
                if(COOLTime.down==0){
                  if(C_N){
                    ChoiceText[C_N].選択 = false;
                    ChoiceText[C_N]._element.textContent = ChoiceText[C_N]._element.textContent.substring(2);
                    C_N--;
                    ChoiceText[C_N].選択 = true;
                    ChoiceText[C_N]._element.textContent = "▶ " + ChoiceText[C_N]._element.textContent;
                    Next = Datas[k].選択肢[C_N+1].next;
                  }
                  COOLTime.down = 5;
                }
              }
              if(game.input.up){
                if(COOLTime.up==0){
                  if(C_N < Object.keys(Datas[k].選択肢).length-1){
                    ChoiceText[C_N].選択 = false;
                    ChoiceText[C_N]._element.textContent = ChoiceText[C_N]._element.textContent.substring(2);
                    C_N++;
                    ChoiceText[C_N].選択 = true;
                    ChoiceText[C_N]._element.textContent = "▶ " + ChoiceText[C_N]._element.textContent;
                    Next = Datas[k].選択肢[C_N+1].next;
                  }
                  COOLTime.up = 5;
                }
              }
            }
            if(Key_x){
              Image[Images_Data.テキストボックス].opacity = 0;
              for(var i = 0; i < 90; i++) Text[i].opacity = 0;
              if(Datas[k].選択肢){
                for(var j = 0; j < Object.keys(Datas[k].選択肢).length; j++){
                  ChoiceText[j].opacity = 0;
                  Image[Images_Data["選択肢"+j]].opacity = 0;
                };
              };
            }
            else{
              Image[Images_Data.テキストボックス].opacity = 0.5;
              for(var i = 0; i < 90; i++) Text[i].opacity = 1;
              if(Datas[k].選択肢){
                for(var j = 0; j < Object.keys(Datas[k].選択肢).length; j++){
                  ChoiceText[j].opacity = 1;
                  Image[Images_Data["選択肢"+j]].opacity = 0.5;
                };
              };
            };
            if(Key_c && COOLTime.c_key == 0 && Image[Images_Data.テキストボックス].opacity == 0.5){
              COOLTime.c_key = 5;
              for(var j = 0; j < 5; j++){
                ChoiceText[j].opacity = 0;
                Image[Images_Data["選択肢"+j]].opacity = 0;
              }
              Keydown_c();
            };
          };
        };
      });

      function Keydown_c(){
        if(Datas[k+1]||Next){
          if(Next) k = Next;
          else k++;
          if(!Datas[k]) Datas[k] = {"text":"存在しないデータ。"};
          Next = Datas[k].next;
          if(Datas[k].音) SE1.src = Datas[k].音;
          if(Datas[k].image){
            i = 1;
            while(Datas[k].image[i]){
              if(Datas[k].image[i].src){
                Image[Images_Data[Datas[k].image[i].name]]._element.src = Datas[k].image[i].src;
              }
              if(Datas[k].image[i].width){
                Image[Images_Data[Datas[k].image[i].name]].width = Datas[k].image[i].width;
              }
              if(Datas[k].image[i].height){
                Image[Images_Data[Datas[k].image[i].name]].height = Datas[k].image[i].height;
              }
              if(Datas[k].image[i].x){
                Image[Images_Data[Datas[k].image[i].name]].x = Datas[k].image[i].x;
              }
              if(Datas[k].image[i].y){
                Image[Images_Data[Datas[k].image[i].name]].y = Datas[k].image[i].y;
              }
              i++;
            }
          };
          if(Datas[k].フラグ){
            if(!Flag[Datas[k].フラグ]) Flag[Datas[k].フラグ] = 0;
            if(Datas[k].増加量!=undefined) Flag[Datas[k].フラグ] += Datas[k].増加量;
            if(Datas[k].固定値!=undefined) Flag[Datas[k].フラグ] = Datas[k].固定値;
          };
          if(Datas[k].BGM){
            BGM.name1 = Datas[k].BGM;
            if(BGM.name1 != BGM.name2){
              BGM.src = BGM.name1;
              BGM.name2 = BGM.name1;
              if(BGM.src){
                if(BGM.paused) BGM.play();
                else BGM.currentTime = 0;
                if(Datas[k].BGMED) BGM.id = Datas[k].BGMED;
                else BGM.id = 0;
              }
            }
          };
          if(Datas[k].セーブ){
            switch(Datas[k].セーブ){
              case "削除":
                window.localStorage.clear();
                break;
              default:
                window.localStorage.setItem("Flag",JSON.stringify(Flag));
                window.localStorage.setItem("Stage",JSON.stringify(Stage));
                window.localStorage.setItem("Stage_X",JSON.stringify(Stage_X));
                window.localStorage.setItem("Stage_Y",JSON.stringify(Stage_Y));
                window.localStorage.setItem("Character_X",JSON.stringify(Character_X));
                window.localStorage.setItem("Character_Y",JSON.stringify(Character_Y));
                window.localStorage.setItem("Character_direction",JSON.stringify(Character_direction));
                console.log("セーブ完了。");
                break;
            }
          };
          i = 0;
          for(var a = 0; a < 90; a++){
            Text[a]._element.textContent = "";
          }
          if(Datas[k].text){
            if(Datas[k].text.indexOf(":")==-1) Write = 1;
            else Write = 2;
            Text_write();
          }
          else Keydown_c();
        }
        else{
          Key_z = false;
          Key_x = false;
          Key_c = false;
          game.popScene();
          if(Datas[k].ステージ移動){
            if(Datas[k].x) Character_X = Datas[k].x;
            if(Datas[k].y) Character_Y = Datas[k].y;
            if(Datas[k].向き) Character_direction = Datas[k].向き;
            Stage = Datas[k].ステージ移動;
            Key_z = false;
            Key_x = false;
            Key_c = false;
            game.input.up = false;
            game.input.down = false;
            game.input.left = false;
            game.input.right = false;
            Scene_Check_Scene(Stage_Datas[Stage]);
          }
        }
        return;
      };

      for(var j = 0; j < 5; j++){
        Image[Images_Data["選択肢"+j]].addEventListener("touchend",function(e){
          if(this.opacity) Choice_Choice(this);
          return;
        });
        ChoiceText[j].addEventListener("touchend",function(e){
          if(this.opacity) Choice_Choice(Image[Images_Data["選択肢"+this.Number]]);
          return;
        });
      };

      function Choice_Choice(image){
        if(ChoiceText[image.Number].選択){
          for(var a = 0; a < 5; a++){
            ChoiceText[a].opacity = 0;
            Image[Images_Data["選択肢"+a]].opacity = 0;
          }
          Keydown_c();
        }
        else{
          for(var a = 0; a < 5; a++){
            ChoiceText[a].選択 = false;
            ChoiceText[a]._element.textContent = Image[Images_Data["選択肢"+a]].text;
          }
          C_N = image.Number;
          Next = image.next;
          ChoiceText[image.Number].選択 = true;
          ChoiceText[image.Number]._element.textContent = "▶ " + image.text;
        }
      };

      Image[Images_Data.背景].addEventListener("touchstart",function(e){
        Key_x = true;
        return;
      });

      Image[Images_Data.背景].addEventListener("touchend",function(e){
        Key_x = false;
        return;
      });

      Image[Images_Data.テキストボックス].addEventListener("touchstart",function(e){
        if(!Datas[k].選択肢) Key_c = true;
        return;
      });

      Image[Images_Data.テキストボックス].addEventListener("touchend",function(e){
        Key_c = false;
        return;
      });

      if(HTML == "編集"){

        var Ui_Button = [];
        var Hensyu_mood = false;
        var Inputs = [];

        function Input(x,y,w,h,v,p){
          Inputs[Inputs.length] = new Entity();
          Inputs[Inputs.length-1].moveTo(x,y+900);
          Inputs[Inputs.length-1].width = w;
          Inputs[Inputs.length-1].height = h;
          Inputs[Inputs.length-1]._element = document.createElement("textarea");
          Inputs[Inputs.length-1]._style["font-size"] = 60;
          Inputs[Inputs.length-1]._element.value = v;
          Inputs[Inputs.length-1]._element.placeholder = p;
        };

        function Buttons(x,y,a){
          Ui_Button[Ui_Button.length] = new Button(a,"light",width/4,height/10);
          Ui_Button[Ui_Button.length-1].moveTo(x,y);
          Ui_Button[Ui_Button.length-1]._style["font-size"] = height/20;
          if(!a) Ui_Button[Ui_Button.length-1].opacity = 0;
          scene.addChild(Ui_Button[Ui_Button.length-1]);
          Ui_Button[Ui_Button.length-1].addEventListener("touchstart",function(e){
            Hensyu_mood = true;
            if(this.opacity==0) return;
            switch(this.text){
              case "画像設定":
                if(!Datas[k].image) Datas[k].image = {1:{name:Pull_down1._element.value}};
                else Datas[k].image[Object.keys(Datas[k].image).length+1] = {name:Pull_down1._element.value};
                if(Inputs[8]._element.value!=undefined) Datas[k].image[Object.keys(Datas[k].image).length].src = Inputs[8]._element.value;
                if(Inputs[9]._element.value!=undefined) Datas[k].image[Object.keys(Datas[k].image).length].x = Inputs[9]._element.value*1;
                if(Inputs[10]._element.value!=undefined) Datas[k].image[Object.keys(Datas[k].image).length].y = Inputs[10]._element.value*1;
                if(Inputs[11]._element.value!=undefined) Datas[k].image[Object.keys(Datas[k].image).length].width = Inputs[11]._element.value*1;
                if(Inputs[12]._element.value!=undefined) Datas[k].image[Object.keys(Datas[k].image).length].height = Inputs[12]._element.value*1;
                Stage_Datas[Chat] = Datas;
                game.replaceScene(Chat_Scene(Datas));
                break;
              case "画像変更":
                if(Datas[k].image){
                  for (var o = 0; o < Object.keys(Datas[k].image).length; o++){
                    if(Datas[k].image[Object.keys(Datas[k].image)[o]].name==Pull_down1._element.value){
                      break;
                    };
                  };
                  if(o == Object.keys(Datas[k].image).length){
                    Datas[k].image[Object.keys(Datas[k].image).length] = {name:Pull_down1._element.value};
                  };
                }
                else Datas[k].image = {1:{name:Pull_down1._element.value}};
                for (var o = 0; o < Object.keys(Datas[k].image).length; o++){
                  if(Datas[k].image[Object.keys(Datas[k].image)[o]].name==Pull_down1._element.value){
                    break;
                  };
                };
                if(Datas[k].image[Object.keys(Datas[k].image)[o]].src!=undefined) Inputs[8]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].src;
                if(Datas[k].image[Object.keys(Datas[k].image)[o]].x!=undefined) Inputs[9]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].x;
                if(Datas[k].image[Object.keys(Datas[k].image)[o]].y!=undefined) Inputs[10]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].y;
                if(Datas[k].image[Object.keys(Datas[k].image)[o]].width!=undefined) Inputs[11]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].width;
                if(Datas[k].image[Object.keys(Datas[k].image)[o]].height!=undefined) Inputs[12]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].height;
                Button_C();
                Button_C(3,"画像設定");
                scene.addChild(Pull_down1);
                scene.removeChild(Inputs[0]);
                scene.removeChild(Inputs[1]);
                scene.removeChild(Inputs[2]);
                scene.removeChild(Inputs[3]);
                scene.removeChild(Inputs[4]);
                scene.removeChild(Inputs[5]);
                scene.removeChild(Inputs[6]);
                scene.addChild(Inputs[8]);
                scene.addChild(Inputs[9]);
                scene.addChild(Inputs[10]);
                scene.addChild(Inputs[11]);
                scene.addChild(Inputs[12]);
                break;
              case "画像追加":
                if(Inputs[7]._element.value){
                  if(Datas.image){
                    Datas.image[Object.keys(Datas.image).length+1] = {name:Inputs[7]._element.value};
                  }
                  else Datas.image = {1:{name:Inputs[7]._element.value}};
                  Stage_Datas[Chat] = Datas;
                  game.replaceScene(Chat_Scene(Datas));
                }
                break;
              case "画像全消":
                delete Datas.image;
                Stage_Datas[Chat] = Datas;
                game.replaceScene(Chat_Scene(Datas));
                break;
              case "全選択消":
                delete Datas[k].選択肢;
                Stage_Datas[Chat] = Datas;
                game.replaceScene(Chat_Scene(Datas));
                break;
              case "設定":
                if(Datas[k].text) Inputs[0]._element.value = Datas[k].text;
                if(Datas[k].next) Inputs[1]._element.value = Datas[k].next;
                if(Datas[k].音) Inputs[2]._element.value = Datas[k].音;
                if(Datas[k].BGM) Inputs[3]._element.value = Datas[k].BGM;
                if(Datas[k].フラグ) Inputs[4]._element.value = Datas[k].フラグ;
                scene.addChild(Inputs[0]);
                scene.addChild(Inputs[1]);
                scene.addChild(Inputs[2]);
                scene.addChild(Inputs[3]);
                scene.addChild(Inputs[4]);
                scene.addChild(Inputs[5]);
                scene.addChild(Inputs[6]);
                scene.removeChild(Inputs[7]);
                Button_C();
                Button_C(0,"決定");
                Button_C(1,"全選択消");
                if(Datas.image) Button_C(3,"画像変更");
                break;
              case "決定":
                if(Inputs[0]._element.value){
                  Datas[k].text = Inputs[0]._element.value;
                }
                else delete Datas[k].text;
                if(Inputs[1]._element.value){
                  Datas[k].next = Inputs[1]._element.value;
                }
                else delete Datas[k].next;
                if(Inputs[2]._element.value){
                  Datas[k].音 = Inputs[2]._element.value;
                }
                else delete Datas[k].音;
                if(Inputs[3]._element.value){
                  Datas[k].BGM = Inputs[3]._element.value;
                }
                else delete Datas[k].BGM;
                if(Inputs[4]._element.value){
                  Datas[k].フラグ = Inputs[4]._element.value;
                }
                else delete Datas[k].フラグ;
                if(Inputs[5]._element.value){
                  if(Datas[k].選択肢){
                    if(Object.keys(Datas[k].選択肢).length < 5){
                      Datas[k].選択肢[Object.keys(Datas[k].選択肢).length+1] = {};
                      Datas[k].選択肢[Object.keys(Datas[k].選択肢).length].text = Inputs[5]._element.value;
                      if(Inputs[6]._element.value){
                        Datas[k].選択肢[Object.keys(Datas[k].選択肢).length].next = Inputs[6]._element.value;
                      }
                    }
                  }
                  else Datas[k].選択肢 = {1:{text:Inputs[5]._element.value,next:Inputs[6]._element.value}};
                }
                Stage_Datas[Chat] = Datas;
                game.replaceScene(Chat_Scene(Datas));
                break;
              case "終了":
                Stage_Datas[Chat] = Datas;
                game.replaceScene(Chat_Scene(Datas));
                break;
            };
          });
        };

        if(Datas.image){
          var Pull_down1 = new Entity();
          Pull_down1.moveTo(0,height/10*1+900);
          Pull_down1.width = width/4;
          Pull_down1.height = height/10;
          Pull_down1._element = document.createElement("select");
          Pull_down1._style["font-size"] = 60;
          var Option1 = [];
          for (var o = 0; o < Object.keys(Datas.image).length; o++){
            Option1[o] = document.createElement("option");
            Option1[o].text =  Datas.image[Object.keys(Datas.image)[o]].name;
            Option1[o].value = Datas.image[Object.keys(Datas.image)[o]].name;
            Pull_down1._element.appendChild(Option1[o]);
          };
          Pull_down1.addEventListener("touchend",function(e){
            if(Datas[k].image){
              for (var o = 0; o < Object.keys(Datas[k].image).length; o++){
                if(Datas[k].image[Object.keys(Datas[k].image)[o]].name==Pull_down1._element.value){
                  break;
                };
              };
              if(Datas[k].image[Object.keys(Datas[k].image)[o]].src!=undefined) Inputs[8]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].src;
              if(Datas[k].image[Object.keys(Datas[k].image)[o]].x!=undefined) Inputs[9]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].x;
              if(Datas[k].image[Object.keys(Datas[k].image)[o]].y!=undefined) Inputs[10]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].y;
              if(Datas[k].image[Object.keys(Datas[k].image)[o]].width!=undefined) Inputs[11]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].width;
              if(Datas[k].image[Object.keys(Datas[k].image)[o]].height!=undefined) Inputs[12]._element.value = Datas[k].image[Object.keys(Datas[k].image)[o]].height;
            };
          });
        };

        Buttons(width/4*0,height/10*0 + 900,"設定");
        Buttons(width/4*1,height/10*0 + 900,"画像全消");
        Buttons(width/4*3,height/10*0 + 900,"画像追加");
        Buttons(width/4*0,height/10*2 + 900,"");
        Buttons(width/4*3,height/10*4 + 900,"終了");

        Input(width/4*0,height/10*1,width/4,height/10,"","テキスト");
        Input(width/4*1,height/10*1,width/4,height/10,"","ネクスト");
        Input(width/4*2,height/10*1,width/4,height/10,"","テキストサウンドのURL");
        Input(width/4*3,height/10*1,width/4,height/10,"","BGM");
        Input(width/4*3,height/10*2,width/4,height/10,"","フラグ");
        Input(width/4*2,height/10*0,width/4,height/10,"","選択肢");
        Input(width/4*3,height/10*0,width/4,height/10,"","選択肢の分岐");
        Input(width/4*2,height/10*0,width/4,height/10,"","画像の名前");
        Input(width/4*1,height/10*1,width/4,height/10,"","画像のURL");
        Input(width/4*0,height/10*0,width/4,height/10,"","画像のx座標");
        Input(width/4*1,height/10*0,width/4,height/10,"","画像のy座標");
        Input(width/4*2,height/10*0,width/4,height/10,"","画像の幅");
        Input(width/4*3,height/10*0,width/4,height/10,"","画像の高さ");
        scene.addChild(Inputs[7]);

        function Button_C(a,b){
          switch(a){
            case undefined:
              for (var i = 0; i < Ui_Button.length-1; i++) {
                Ui_Button[i].text = "";
                Ui_Button[i].opacity = 0;
              }
              break;
            default:
              Ui_Button[a].text = b;
              Ui_Button[a].opacity = 1;
              break;
          }
          return;
        };

      };

      return scene;
    };
    var Blackout_Scene = function(Datas){

      var scene = new Scene();

      var Blackout = new Sprite();
      Blackout._element = document.createElement("img");
      Blackout._element.src = "image/黒.png";
      Blackout.width = width;
      Blackout.height = height;
      Blackout.opacity = 0;
      Blackout.tl.fadeIn(10);
      scene.addChild(Blackout);

      scene.addEventListener("enterframe",function(){

        if(Blackout.opacity==1){
          game.popScene();
          game.replaceScene(Map_Scene(Datas));
        };

      });

      return scene;
    };

    function Scene_Check_Scene(Datas){
      if(Datas.move){
        Move_box = Datas.move;
        Move_box_length = 0;
      };
      switch (Datas.type) {
        case "マップ":
          game.pushScene(Blackout_Scene(Datas));
          break;
        case "メイン":
          game.replaceScene(Main_Scene(Datas));
          break;
        case "会話":
          game.pushScene(Chat_Scene(Datas));
          break;
        case "ジャンプ":
          Character_X = Datas.x;
          Character_Y = Datas.y;
          Character_direction = Datas.向き;
          Scene_Check_Scene(Stage_Datas[Datas.next]);
          break;
      };
      return;
    };

    if(window.localStorage.getItem("Flag")){
      Flag = window.localStorage.getItem("Flag");
      Flag = JSON.parse(Flag);
    };
    if(window.localStorage.getItem("Stage")){
      Stage = window.localStorage.getItem("Stage");
      Stage = JSON.parse(Stage);
    };
    if(window.localStorage.getItem("Stage_X")){
      Stage_X = window.localStorage.getItem("Stage_X");
      Stage_X = JSON.parse(Stage_X);
    };
    if(window.localStorage.getItem("Stage_Y")){
      Stage_Y = window.localStorage.getItem("Stage_Y");
      Stage_Y = JSON.parse(Stage_Y);
    };
    if(window.localStorage.getItem("Character_X")){
      Character_X = window.localStorage.getItem("Character_X");
      Character_X = JSON.parse(Character_X);
    };
    if(window.localStorage.getItem("Character_Y")){
      Character_Y = window.localStorage.getItem("Character_Y");
      Character_Y = JSON.parse(Character_Y);
    };
    if(window.localStorage.getItem("Character_direction")){
      Character_direction = window.localStorage.getItem("Character_direction");
      Character_direction = JSON.parse(Character_direction);
    };

    switch (HTML) {
      case "管理者":
        var Body = "書き込み" + JSON.stringify(Stage_Datas);
        break;
      case "編集":
        if(window.localStorage.getItem("ローカルステージデータ")){
          Stage_Datas = window.localStorage.getItem("ローカルステージデータ");
          Stage_Datas = JSON.parse(Stage_Datas);
        }
        else Stage_Datas = {};
        var Body = "読み込み";
        break;
      default:
        Stage_Datas = {};
        var Body = "読み込み";
        break;
    };

    var URL = "https://script.google.com/macros/s/AKfycbw2Dx5NjCfQRv1TlpH0kSnvzvZrrLXoWI55JSpuda8XYxwEwbMd/exec";
    var Options = {
      method: "POST",
      body:JSON.stringify({Sheet_id:"13esnJ1oLnt2hvzpK6pQEJW_kVF8UkUV_u3P55zpouBM",Sheet_name:"ゲームデータ"})
    };

    fetch(URL,Options).then(res => res.json()).then(result => {
      for (var i = 0; i < result.length; i++) {
        if(result[i]){
          result[i] = JSON.parse(result[i].データ1);
          Stage_Datas[result[i].name] = result[i];
          delete Stage_Datas[result[i].name].name;
        }
        else break;
      }
      if(!Stage_Datas[Stage]) Stage = "最初";
      Scene_Check_Scene(Stage_Datas[Stage]);
      return;
    },);
  }
  game.start();
}
