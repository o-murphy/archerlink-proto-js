import ArcherProtocol from './archer_protocol_pb.js'; // Adjust import path as needed

export const buildGetCurrentDevStatusPayload = () => {
    const getHostDevStatus = new ArcherProtocol.GetHostDevStatus();
    const command = new ArcherProtocol.Command();
    command.setGethostdevstatus(getHostDevStatus);
    const clientPayload = new ArcherProtocol.ClientPayload();
    clientPayload.setCommand(command)
    console.log("getter payload", JSON.stringify(clientPayload.toObject()))
    return clientPayload.serializeBinary();
}

export const parseGetCurrentDevStatus = async (payload) => {
    try {
        // Check if payload is a Blob
        if (payload instanceof Blob) {
            payload = await payload.arrayBuffer();
        }

        // Ensure payload is an ArrayBuffer and convert to Uint8Array
        const uint8Array = new Uint8Array(payload);

        // Deserialize the binary data
        const hostPayload = ArcherProtocol.HostPayload.deserializeBinary(uint8Array);

        // Log the parsed object to inspect its contents
        console.log('Parsed host payload:', hostPayload.toObject());

        return hostPayload.toObject(); // Return the parsed object
    } catch (error) {
        console.error('Error parsing current dev status:', error);
        return null;
    }
};

export const buildTriggerFFCPayload = () => {
    // Create a TriggerCmd message with the TRIGGER_FFC command
    const triggerCmd = new ArcherProtocol.TriggerCmd();
    triggerCmd.setCmd(ArcherProtocol.CMDDirect.TRIGGER_FFC)

    // Create a Command message and set the TriggerCmd message directly in the constructor
    const command = new ArcherProtocol.Command();
    command.setCmdtrigger(triggerCmd); // Assuming this method exists

    // Create a ClientPayload message and set the Command message directly in the constructor
    const clientPayload = new ArcherProtocol.ClientPayload();
    clientPayload.setCommand(command); // Assuming this method exists

    // Serialize the ClientPayload message to a binary string
    return clientPayload.serializeBinary();
};

const getNextZoomLevel = (currentZoom, maxZoom) => {
    // Convert the enum values to an array and get their keys
    const Zoom = ArcherProtocol.Zoom
    const zoomLevels = Object.keys(Zoom)
        .filter(key => !isNaN(Number(Zoom[key]))) // Filter out non-numeric keys
        .map(key => Zoom[key])
        .filter(value => value !== Zoom.UNKNOWN_ZOOM_LEVEL); // Filter out UNKNOWN_ZOOM_LEVEL

    // Filter by maxZoom if maxZoom > UNKNOWN_ZOOM_LEVEL
    const filteredZoomLevels = maxZoom > Zoom.UNKNOWN_ZOOM_LEVEL
        ? zoomLevels.filter(value => value <= maxZoom)
        : zoomLevels;

    // Find the index of the current zoom level
    const currentIndex = filteredZoomLevels.indexOf(currentZoom);

    // Debugging information
    console.log("Zoom Levels Array:", filteredZoomLevels);
    console.log("Current Zoom:", currentZoom);
    console.log("Current Index:", currentIndex);

    if (currentIndex === -1) {
        throw new Error(`Invalid current zoom level: ${currentZoom}`);
    }

    // Calculate the next index in a circular manner
    const nextIndex = (currentIndex + 1) % filteredZoomLevels.length;

    // Debugging information
    console.log("Next Index:", nextIndex);
    console.log("Next Zoom Level:", filteredZoomLevels[nextIndex]);

    return filteredZoomLevels[nextIndex];
};

export const buildSetZoomLevelPayload = (zoomCur, zoomMax) => {
    // Create a SetZoomLevel message and set the zoom level
    const setZoomLevel = new ArcherProtocol.SetZoomLevel();
    const nextZoom = getNextZoomLevel(zoomCur, zoomMax)
    setZoomLevel.setZoomlevel(nextZoom);

    // Create a Command message and set the SetZoomLevel message
    const command = new ArcherProtocol.Command();
    command.setSetzoom(setZoomLevel);

    // Create a ClientPayload message and set the Command message
    const clientPayload = new ArcherProtocol.ClientPayload();
    clientPayload.setCommand(command);

    // Serialize the ClientPayload message to a binary string (Uint8Array)
    return clientPayload.serializeBinary();
};

const getNextAgcMode = (currentAgc) => {
    const AGCMode = archerProtocol.AGCMode;

    // Convert the enum values to an array and get their keys
    const agcModes = Object.keys(AGCMode)
        .filter(key => !isNaN(Number(AGCMode[key]))) // Filter out non-numeric keys
        .map(key => AGCMode[key])
        .filter(value => value !== AGCMode.UNKNOWN_AGC_MODE); // Filter out UNKNOWN_AGC_MODE

    // Find the index of the current AGC mode
    const currentIndex = agcModes.indexOf(currentAgc);

    // Debugging information
    console.log("AGC Modes Array:", agcModes);
    console.log("Current AGC:", currentAgc);
    console.log("Current Index:", currentIndex);

    if (currentIndex === -1) {
        throw new Error(`Invalid current AGC mode: ${currentAgc}`);
    }

    // Calculate the next index in a circular manner
    const nextIndex = (currentIndex + 1) % agcModes.length;

    // Debugging information
    console.log("Next Index:", nextIndex);
    console.log("Next AGC Mode:", agcModes[nextIndex]);

    return agcModes[nextIndex];
};

export const buildSetAgcModePayload = (agcCur) => {
    // Create a SetAgcMode message and set the mode
    const setAgc = new archerProtocol.SetAgcMode();
    setAgc.setMode(getNextAgcMode(agcCur));

    // Create a Command message and set the SetAgcMode message
    const command = new archerProtocol.Command();
    command.setSetagc(setAgc);

    // Create a ClientPayload message and set the Command message
    const clientPayload = new archerProtocol.ClientPayload();
    clientPayload.setCommand(command);

    // Serialize the ClientPayload message to a binary string (Uint8Array)
    return clientPayload.serializeBinary();
}

const getNextColorScheme = (currentColor) => {
    const ColorScheme = archerProtocol.ColorScheme;

    // Convert the enum values to an array and get their keys
    const colorSchemes = Object.keys(ColorScheme)
        .filter(key => !isNaN(Number(ColorScheme[key]))) // Filter out non-numeric keys
        .map(key => ColorScheme[key])
        .filter(value => value !== ColorScheme.UNKNOWN_COLOR_SHEME); // Filter out UNKNOWN_COLOR_SHEME

    // Find the index of the current color scheme
    const currentIndex = colorSchemes.indexOf(currentColor);

    // Debugging information
    console.log("Color Schemes Array:", colorSchemes);
    console.log("Current Color Scheme:", currentColor);
    console.log("Current Index:", currentIndex);

    if (currentIndex === -1) {
        throw new Error(`Invalid current color scheme: ${currentColor}`);
    }

    // Calculate the next index in a circular manner
    const nextIndex = (currentIndex + 1) % colorSchemes.length;

    // Debugging information
    console.log("Next Index:", nextIndex);
    console.log("Next Color Scheme:", colorSchemes[nextIndex]);

    return colorSchemes[nextIndex];
};

export const buildSetColorScheme = (colorScheme) => {
    const setColor = new archerProtocol.SetColorScheme();
    setColor.setScheme(getNextColorScheme(colorScheme));

    // Create a Command message and set the SetColorScheme message
    const command = new archerProtocol.Command();
    console.log('command', command)

    command.setSetpallette(setColor);

    // Create a ClientPayload message and set the Command message
    const clientPayload = new archerProtocol.ClientPayload();
    clientPayload.setCommand(command);

    // Serialize the ClientPayload message to a binary string
    return  clientPayload.serializeBinary();
};

export default ArcherProtocol;