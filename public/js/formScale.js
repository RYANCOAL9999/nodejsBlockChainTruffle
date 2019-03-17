function test()
{
    var viewport_meta = document.getElementsByName('viewport');
    var scale = screen.width/window.innerWidth;
    if(screen.width < 1000)
    {
        switch(screen.width)
        {
            case 240 : scale -= 0.020;break;
            case 280 : scale += 0.020;break;
            case 320 : scale += 0.055;break;
            case 360 : scale += 0.095;break;
            case 375 : scale += 0.110;break;
            case 411 :
            case 414 : scale += 0.145;break;
            case 480 : scale += 0.195;break;
            case 720 : scale += 0.290;break;
            case 768 : scale += 0.310;break;
            case 800 : scale += 0.320;break;
        }
        viewport_meta[0].content = `width=device-width, initial-scale=${scale} maximum-scale=1.0, minimum-scale=${scale}`;
    }
    else
    {
        viewport_meta[0].content = `width=device-width, initial-scale=0.98 maximum-scale=1.0, minimum-scale=0.98`;
    }
}