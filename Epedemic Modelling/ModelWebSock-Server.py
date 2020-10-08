# Direct server connection to web client. For test and demonstration purposes only

import asyncio
import websockets
import json.decoder
import EpidemicModel


def getAllCells():
    print("inside getAllCells")


def processControlMsg(msg, data):
    print("Control message is: " + msg + "\n--------")

    switcher = {
        'initApp': EpidemicModel.initApp,
        'nextStep': EpidemicModel.nextStep,
        'getAllCells': EpidemicModel.getAllCells,
    }
    # Get the function from the switcher dictionary
    func = switcher.get(msg, lambda: "Invalid control message.")
    return func(data)

async def comms(websocket, path):
    async for message in websocket:
        indat = json.loads(message)
        print(indat)

        # -------
        # Parse the json from client to retrieve the control message
        ctrlMsg = indat['control']
        response = ""
        response = processControlMsg(ctrlMsg, indat)
        print("--------")
        print("Response: " + response['status'])
        print(response)

        # -------

        # json.dumps(outdat)
        await websocket.send(response['status'])

start_server = websockets.serve(comms, "localhost", 8002)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()