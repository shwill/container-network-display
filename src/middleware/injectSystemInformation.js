import os from "os";
import process from "process"
import { readFileSync } from "fs"

import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import relativeTime from "dayjs/plugin/relativeTime.js"

dayjs.extend(duration)
dayjs.extend(relativeTime)

const getAppMeta = () => {
    const { name, version } = JSON.parse(readFileSync("package.json", { encoding: "utf-8"}));
    return {
        name, version
    }
}

const getUptime = () => {
    const UP_SINCE_SECONDS = process.uptime()
       
    const UPTIME =  {
        startTime: dayjs().subtract(UP_SINCE_SECONDS, "second").format('HH:mm:ss'),
        duration: dayjs.duration(-1 * UP_SINCE_SECONDS, "second").humanize(true)
    }

    return UPTIME
}

const getOSInformation = () => {
    const CORES = os.cpus();
    let cpuCoreDescription = "n/a"

    const CORES_COUNT = CORES.length + 1
    if (CORES_COUNT) {
        cpuCoreDescription = `${CORES_COUNT} * ${CORES[0].model} (${(CORES[0].speed ).toFixed(3)} MHz)`;
    }

    return {
        hostname: os.hostname(),
        memory: `${os.totalmem() / 1024 / 1024} GB`,
        cpu: cpuCoreDescription
    }
}

const getNICs = () => {
    const INTERFACES = os.networkInterfaces();
    let nics =[] 
   
    for (let nic in INTERFACES) {
        for (let stack of INTERFACES[nic]) {

            const existing = nics.find(n => n.interface === nic)
            if (!existing) {
                nics.push({interface: nic, mac: stack.mac, type: stack.internal ? "Internal" : "External", stacks: [{family: `IPv${stack.family}`, address: stack.address, netmask: stack.netmask, cidr: stack.cidr}] })
            } else {
                existing.stacks.push({family: `IPv${stack.family}`, address: stack.address, netmask: stack.netmask, cidr: stack.cidr})
                existing.stacks = existing.stacks.sort((a,b) => a.family < b.family ? -1 : 1);
            }
        }
    }
    
    nics = nics.sort((a,b) => a.interface < b.interface ? -1 : a.interface > b.interface ? 1 : 0);
    return nics;
}

const systemInfo = {
    ...getOSInformation(),
    app: getAppMeta(),
    nics: getNICs()
}

export const getSystemInformation = () => ({
    ...systemInfo,
    uptime: getUptime(),
})

export default (req, _, next) => {
    const SYSTEM_INFORMATION = getSystemInformation();
    req.systemInformation = SYSTEM_INFORMATION
    return next();
}