import QtQuick 2.5
import QtQuick.Window 2.2
import "Scripts.js" as Scripts

Window {
    visible: true
    width: 350
    height: 640
    title: qsTr("Bejeweled")

    Rectangle {
        id: board
        width: parent.width < parent.height ? parent.width : parent.height
        height: width
        color: "azure"

        property int jewelSize: Math.floor(width / 10)
        property bool play: false
        property bool end: false

        Text {
            id: welcome
            anchors.centerIn: parent
            font.pixelSize: parent.width / 8
            font.italic: true
            font.bold: true
            color: "blue"
            text: "Bejeweled<br>by Kuba"
        }

        Rectangle {
            id: endScreen
            color: "azure"
            anchors.fill: parent
            visible: parent.end
            z: 1

            Text {
                id: endText
                anchors.centerIn: parent
                font.pixelSize: parent.width / 10
                color: "orange"
                text: "Tap to restart!"
            }
        }

        MouseArea {
            anchors.fill: parent
            onClicked: {
                if(parent.end) {
                    Scripts.reset();
                    parent.end = false;
                }
                else if(!parent.play)
                {
                    console.log(parent.children.length);
                    Scripts.spawnJewels();
                    parent.play = true;
                    welcome.visible = false;
                }
                else
                {
                    Scripts.clicked(mouse.x, mouse.y);
                }
            }
        }
    }
    Rectangle {
        id: scoreBoard
        anchors.top: board.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        color: "azure"
        Text {
            id: score
            property int score: 0
            property int mLeft: Scripts.movesPerRound
            property int hScore: 0
            anchors.centerIn: parent
            font.pixelSize: (parent.width > parent.height ? parent.height / 7 : parent.width / 8)
            color: "orange"
            text: "Your score: " + score.score + "<br>Moves left: " + score.mLeft + "<br>High score: " + score.hScore
        }
    }
}
