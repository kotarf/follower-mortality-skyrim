/* global ngapp, xelib, registerPatcher, patcherUrl */

// this patcher doesn't do anything useful, it's just a heavily commented
// example of how to create a UPF patcher.
registerPatcher({
    info: info,
    // array of the game modes your patcher works with
    // see docs://Development/APIs/xelib/Setup for a list of game modes
    gameModes: [xelib.gmSSE],
    settings: {
        // The label is what gets displayed as the settings tab's label
        label: 'Mortal Followers Patcher',
        // if you set hide to true the settings tab will not be displayed
        hide: true,
        templateUrl: `${patcherUrl}/partials/settings.html`,
    },
    // optional array of required filenames.  can omit if empty.
    requiredFiles: [],

    execute: (patchFile, helpers, settings, locals) => ({
        // required: array of process blocks. each process block should have both
        // a load and a patch function.
        process: [{
            load: {
                signature: 'NPC_',
                filter: function (record) {
                    let edid = xelib.GetValue(record, 'EDID');
                    let hasPotentialFollowerFaction = xelib.HasArrayItem(record, 'Factions', 'Faction', 'PotentialFollowerFaction');

                    if (edid == 'HousecarlWhiterun') {
                        debugger;
                    }

                    if (hasPotentialFollowerFaction) {
                        helpers.logMessage('Filtering record - factions of ${xelib.longName(record} ' + edid);
                    }

                    // return false to filter out (ignore) a particular record
                    return hasPotentialFollowerFaction;
                },
            },
            patch: function (record) {
                // NOTE Follower frameworks may dynamically adjust these values
                helpers.logMessage(`Patching ${xelib.LongName(record)}`);

                // Non-essential followers
                xelib.SetIsEssential(record, false);

                // Unprotected followers
                xelib.SetFlag(record, 'ACBS\\Flags', 'Protected', true);
            }
        }]
    })
});