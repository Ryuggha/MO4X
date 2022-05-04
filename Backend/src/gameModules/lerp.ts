export default function lerp(tMin: number, tMax: number, vMin: number, vMax: number, vAct: number): number {
    return (((tMax - tMin) * (vAct - vMin)) / (vMax - vMin)) + tMin;
}