export class MouseButtonType
{
    public static NONE: number = 0;
    public static LEFT: number = 1 << 0;
    public static RIGHT: number = 1 << 1;
    public static WHEEL: number = 1 << 2;
    public static EXTRA_BACK: number = 1 << 3;
    public static EXTRA_FORWARD: number = 1 << 4;

    public static parse(buttonsBit: number): number[]
    {
        const ret = [];
        if(!buttonsBit || buttonsBit <= 0)
            return [MouseButtonType.NONE];

        if(MouseButtonType.checkBitFlag(buttonsBit, MouseButtonType.LEFT))
            ret.push(MouseButtonType.LEFT);
        if(MouseButtonType.checkBitFlag(buttonsBit, MouseButtonType.RIGHT))
            ret.push(MouseButtonType.RIGHT);
        if(MouseButtonType.checkBitFlag(buttonsBit, MouseButtonType.WHEEL))
            ret.push(MouseButtonType.WHEEL);
        if(MouseButtonType.checkBitFlag(buttonsBit, MouseButtonType.EXTRA_BACK))
            ret.push(MouseButtonType.EXTRA_BACK);
        if(MouseButtonType.checkBitFlag(buttonsBit, MouseButtonType.EXTRA_FORWARD))
            ret.push(MouseButtonType.EXTRA_FORWARD);

        return ret;
    }

    private static checkBitFlag(value: number, i: number)
    {
        return (value & i) != 0;
    }
}
