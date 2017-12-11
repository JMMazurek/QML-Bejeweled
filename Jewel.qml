import QtQuick 2.0
import "Scripts.js" as Scripts

Rectangle {
    id: rect
    width: board.jewelSize
    height: width
    radius: width / 2
    border.color: "white"
    border.width: 2
    property bool animateY: true
    property int toMove: 0
    property bool toRemove: false
    property bool movingX: false
    property bool movingY: false
    property bool moving: movingX || movingY
    signal movingChange(bool moving)

    state: "normal"
    states: [
        State {
            name: "normal"
            PropertyChanges {
                target: rect
                border.color: "white"
            }
        },
        State {
            name: "selected"
            PropertyChanges {
                target: rect
                border.color: "green"
            }
        }
    ]

    Behavior on x {
        enabled: true
        NumberAnimation { duration: 1000
        onRunningChanged: { movingX = running; }
        }
    }

    Behavior on y {
        enabled: animateY
        NumberAnimation { duration: 1000
        onRunningChanged: { movingY = running; }
        }
    }

    onMovingChanged: {
        movingChange(moving);
    }
}


