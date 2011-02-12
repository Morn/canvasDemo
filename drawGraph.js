// auther: Morn Jan
// date: October 2010


(function() {

	var xmin, xmax, ymin, ymax; 

	 /* functional part*/ 	
	var rotateRect = function(drawing, x, y, n){
		var i; 
		x[n] = x[0]; 
		y[n] = y[0]; 
		drawing.moveTo(xwtov(x[0]), ywtov(y[0])); 
		for(i = 1; i <=  n; i++){
			drawing.lineTo(xwtov(x[i]), ywtov(y[i])); 
		}
		drawing.stroke(); 
		return; 
	}; 

	var xwtov = function(x){
		return (110 + 400 * (x - xmin) / (xmax - xmin)); 
	}; 
    
	var ywtov = function(y){
		return (450 - 400 * (y - ymin) / (ymax - ymin)); 
	}; 
    
    var dtxs = function(x){
        return parseInt(260.0 + 350.0 * (x - xmin) / (xmax - xmin)); 
    }; 

    var dtys = function(y){
         return parseInt(400.0 - 350.0 * (y - ymin) / (xmax - xmin)); 
    }; 

    var dtxs_Mesh = function(x){
        return parseInt(400 * (x - xmin) / (xmax - xmin)); 
    }; 

    var dtys_Mesh = function(y){
         return parseInt(550 - 400 * (y - ymin) / (xmax - xmin)); 
    }; 
    
    var checkCoordinateU = function (u) {
        if (200 * u > 250) {
            return 200 * u - 250; 
        }
        else {
            return 200 * u; 
        }
    }; 
    
    var checkCoordinateV = function (v) {
        if (200 * v > 250) {
            return 200 * v - 250; 
        }
        else {
            return 200 * v; 
        }

    }; 
    
	var colorDataCompare = function (colorDataA, colorDataB) {
		for(var i = 0; i < 4; i++){
			if(colorDataA.data[i] !==  colorDataB.data[i]){
				return false; 
			}
		}
		return true; 
	}; 
    
	var RGB = function (pixelData, r, g, b){
		pixelData.data[0] = r; 
		pixelData.data[1] = g; 
		pixelData.data[2] = b; 
		pixelData.data[3] = 255; 
		return pixelData; 
	}; 
	
	//边界填充
	var BoundaryFill = function(x, y, boundaryPixelData, fillPixelData, drawing){
		var currentPixel = drawing.getImageData(x, y, 1, 1); 
		
		var compararison1 = colorDataCompare(currentPixel, boundaryPixelData); 
		var compararison2 = colorDataCompare(currentPixel, fillPixelData); 
		if(!compararison1 && !compararison2){
			drawing.putImageData(fillPixelData, x, y); 
			drawing.stroke(); 
			BoundaryFill(x, y + 1, boundaryPixelData, fillPixelData, drawing); 
			BoundaryFill(x, y - 1, boundaryPixelData, fillPixelData, drawing); 
			BoundaryFill(x - 1, y, boundaryPixelData, fillPixelData, drawing); 
			BoundaryFill(x + 1, y, boundaryPixelData, fillPixelData, drawing); 
		}
		else {
			return false; 
		}
		
	}; 
    
	var Texture2 = function(u, v){
		//生成二维棋盘格纹理
		return((parseInt(12.0 * u) + parseInt(12.0 * v)) % 2); 
	}; 
    
	var node = function (v1, v2, v3, v4, v5, v6){
		var newObj = {}; 
		newObj.nx = v1; 
		newObj.ny = v2; 
		newObj.nz = v3; 
		newObj.fx = v4; 
		newObj.fy = v5; 
		newObj.fz = v6; 
		return newObj; 
	}; 

	var vectorNode = function (v1, v2, v3, v4, v5, v6, v7){
		var newObj = {}; 
		newObj.i0 = v1; 
		newObj.i1 = v2; 
		newObj.i2 = v3; 
		newObj.i3 = v4; 
		newObj.nx = v5; 
		newObj.ny = v6; 
		newObj.nz = v7; 
		return newObj; 
	}; 	
    
	var cubeNode = function (v1, v2, v3){
		var newObj = {}; 
		newObj.x = v1; 
		newObj.y = v2; 
		newObj.z = v3; 
		return newObj; 
	}; 
    
    var meshNode = cubeNode; 
	
	 /************************************/ 
	
	function drawInTag_1() {
		//画圆

		$("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 	
        /////////////////////////////////////////////// 
		var theta = Math.PI / 1800, 
			alpha = 0, 
			i, 
			x, 
			y; 
            
		for(i = 1; i < 3600; i++){
			alpha +=theta; 
			x = Math.cos(alpha); 
			y = Math.sin(alpha); 
			drawing.lineTo(300 + x * 180, 250 + y * 180); 
			drawing.putImageData(RGB(pixelData, 0, 0, 0), 300 + x * 100, 250 + y * 100); 
		}
		drawing.stroke(); 
        // drawing.fillText("画圆", 10, 10); 
	}
	
	function drawInTag_2(){
		//三视图
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"); 

		var x =  [3, 3, 3, 0, 0, 0], //一个三棱柱。
            y =  [1, 0, 2, 1, 0, 2], 
            z =  [1, 0, 0, 1, 0, 0], 
            es = [0, 1, 0, 0, 1, 2, 3, 3, 4], 
            ed = [1, 2, 2, 3, 4, 5, 4, 5, 5], 
            a = 8, b = 7, tx = 1, ty = 2, tz = 3, 
            xb = [], yb = [], zp = 10, zv = 0, d = 10, 
            i, h, t, l, m, n; 
		
		xmin = 3; xmax = 13; ymin = 2; ymax = 12;  
		
		drawing.moveTo(xwtov(a), ywtov(ymin)); 
		drawing.lineTo(xwtov(a), ywtov(ymax)); 
		drawing.moveTo(xwtov(xmin), ywtov(b)); 
		drawing.lineTo(xwtov(xmax), ywtov(b)); 
		var u = [], v = []; 
		for(i = 0; i < 6; i++){
			u[i] = -x[i]+a-tx; v[i] = z[i]+b+tz; 
		}
		for(i = 0; i < 9; i++){
			drawing.moveTo(xwtov(u[es[i]]), ywtov(v[es[i]])); 
			drawing.lineTo(xwtov(u[ed[i]]), ywtov(v[ed[i]])); 
		}
		for(i = 0; i < 6; i++){
			u[i] = -x[i]+a-tx; v[i] = -y[i]+b-ty; 
		}
		for(i = 0; i < 9; i++){
			drawing.moveTo(xwtov(u[es[i]]), ywtov(v[es[i]])); 
			drawing.lineTo(xwtov(u[ed[i]]), ywtov(v[ed[i]])); 
		}
		for(i = 0; i < 6; i++){
			u[i] = y[i] +a + ty; 
            v[i] = z[i] + b + tz; 
		}
		for(i = 0; i < 9; i++){
			drawing.moveTo(xwtov(u[es[i]]), ywtov(v[es[i]])); 
			drawing.lineTo(xwtov(u[ed[i]]), ywtov(v[ed[i]])); 
		}
		xmin = -2; xmax = 2; ymin = -2; ymax = 2; 
		drawing.moveTo(xwtov(xmin), ywtov(ymin)); 
        drawing.lineTo(xwtov(xmax), ywtov(ymin)); 
		drawing.lineTo(xwtov(xmax), ywtov(ymax)); 
        drawing.lineTo(xwtov(xmin), ywtov(ymax)); 
		drawing.lineTo(xwtov(xmin), ywtov(ymin)); 
		
		drawing.stroke(); 
        // drawing.fillText("三视图", 10, 10); 
	}
	
	function drawInTag_3 () {
		//矩形旋转体
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"), 
            drawing = canvas.getContext("2d"); 
		//////////////////////////////////////// / 
		var i, j, 
            pi, cs, sn, a, b, xf, yf, 
            xa = [], ya = [], xb = [], yb = []; 

		xmin = -2.0; xmax = 2.0; ymin = -2.0; ymax = 2.0; pi = Math.PI; 

		// xa[0] = -1; ya[0] = -1; xa[1] = 1; ya[1] = -1; xa[2] = 1; ya[2] = 1; xa[3] = -1; ya[3] = 1; 
        xa = [-1, 1, 1, -1]; 
        ya = [-1, -1 , 1, 1]; 
		for(i = 0; i <4; i++) {
			xb[i] = xa[i]-1.5; 
			yb[i] = ya[i]+1; 
		}

		for(i = 0; i <4; i++){
			xb[i] = xa[i] * Math.cos(pi / 3.0)-ya[i] * Math.sin(pi / 3.0); 
			yb[i] = xa[i] * Math.sin(pi / 3.0)+ya[i] * Math.cos(pi / 3.0); 
		}
		cs = Math.cos(pi / 18.0); 
		sn = Math.sin(pi / 18.0); 
		for(i = 0; i <9; i++){
			for(j = 0; j <4; j++){
			  xb[j] = xa[j] * cs-ya[j] * sn; 
			  yb[j] = xa[j] * sn+ya[j] * cs; 
			}
			rotateRect(drawing, xb, yb, 4); 
			for(j = 0; j <4; j++){
				xa[j] = xb[j]; ya[j] = yb[j]; 
			}
		}
		
        // drawing.fillText("矩形旋转体", 10, 10); 
	}
	
	function drawInTag_4() {
		//hermit曲线，太极图

        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1),
            pixel = pixelData.data,
            i; 
		
		for(i = 0; i < pixel.length; i += 4){
			pixel[i] = 0; 
			pixel[i + 1] = 2; 
			pixel[i + 2] = 0; 
			pixel[i + 3] = 255; 
		}
		drawing.putImageData(pixelData, 0, 0); 
		pixelData = drawing.getImageData(0, 0, 1, 1); 
		//////////////////////////////////////////
		var x0 = 2, 
			y0 = 1, 
			x1 = 2.2, 
			y1 = 4, 
			xb0 = 5, 
			yb0 = 3, 
			xb1 = 5, 
			yb1 = 3, x, y, t, 
			a3x = 2 * x0 - 2 * x1 + xb0 + xb1, 
			a3y = 2 * y0 - 2 * y1 + yb0 + yb1, 
			a2x = -3 * x0 + 3 * x1 - 2 * xb0 - xb1, 
			a2y = -3 * y0 + 3 * y1 - 2 * yb0 - yb1, 
			a1x = xb0, a1y = yb0, a0x = x0, a0y = y0, 
			
			alpha = 0, 
			theta = Math.PI / 1800; 
		
		for(t = 0.001; t < 1; t += 0.001)
		{
			x = a3x * t * t * t + a2x * t * t + a1x * t + a0x; 
			y = a3y * t * t * t + a2y * t * t + a1y * t + a0y; 
			drawing.putImageData(pixelData, 100 + x * 100 , 20 + y * 100); 
		}
	 
		var boundaryPixelData = pixelData; 

		for(i = 0; i < 3600; i++)
		{
			alpha +=theta; 
			x = Math.cos(alpha); 
			y = Math.sin(alpha); 
			drawing.putImageData(pixelData, 315 + x * 150, 270 + y * 150); 
			drawing.putImageData(pixelData, 280 + x * 30, 200 + y * 30); 
			drawing.putImageData(pixelData, 340 + x * 30, 340 + y * 30); 
		}
		BoundaryFill(280, 220, boundaryPixelData, pixelData, drawing); 
		BoundaryFill(450, 300, boundaryPixelData, pixelData, drawing); 
		drawing.stroke(); 
        // drawing.fillText("hermit曲线，太极图", 10, 10); 
	}
	
	function drawInTag_5 () {
		//绘制RGB颜色立方体的六个表面和一个对角截面
		$("#canvasArea").empty().append(
            ' <canvas id="canvas_tag" width="1100" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"), 
            drawing = canvas.getContext("2d"), 
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////// / 
		var r, g, b; 
        
		b = 0; 
		for(r = 0; r < 256; r++){
			for(g = 0; g < 256; g++){
				drawing.putImageData(RGB(pixelData, r, g, b), r + 30, g + 10); 
			}
		} 	
		b = 255; 
		for(r = 0; r < 256; r++){
			for(g = 0; g < 256; g++){
				drawing.putImageData(RGB(pixelData, r, g, b), r + 290, g + 10); 
			}
		}	
		g = 0; 
		for(r = 0; r < 256; r++){
			for(b = 0; b < 256; b++){
				drawing.putImageData(RGB(pixelData, r, g, b), r + 30, b + 270); 
			}
		}	
		g = 255; 
		for(r = 0; r < 256; r++){
			for(b = 0; b < 256; b++){
				drawing.putImageData(RGB(pixelData, r, g, b), r + 290, b + 270); 
			}
		} 	
		r = 0; 
		for(g = 0; g < 256; g++){
			for(b = 0; b < 256; b++){
				drawing.putImageData(RGB(pixelData, r, g, b), g + 550, b + 10); 
			}
		}
		for(g = 0; g < 256; g++ ){
			for(b = 0; b < 256; b++ ){
				r = g; 
				drawing.putImageData(RGB(pixelData, r, g, b), g + 550, b + 270); 
			}
		}
		r = 125; 
		for(g = 0; g < 256; g++){
			for(b = 0; b < 256; b++){
				drawing.putImageData(RGB(pixelData, r, g, b), g + 810, b + 10); 
			}
		}
		// drawing.fillText("RGB颜色立方体的六个表面和一个对角截面", 10, 10); 
	}
	
	function drawInTag_6 () {
		//绘制三原色混合效果图。
        $("#canvasArea").empty().append(
            ' <canvas id = "canvas_tag" width = "900" height = "600"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"), 
            drawing = canvas.getContext("2d"), 
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////// / 	

		var x0, y0 , x1 , y1 , x2, y2, 
            xx, yy, rr, 
            d0, d1, d2; 
		
		x0 = 300; y0 = 200; x1 = 200; y1 = 360; x2 = 380; y2 = 360; rr = 40000; 
		for(xx = 0; xx < 651; xx++){
			for(yy = 00 ; yy < 621; yy++){
				d0 = (xx - x0) * (xx - x0) + (yy - y0) * (yy - y0); 
				d1 = (xx - x1) * (xx - x1) + (yy - y1) * (yy - y1); 
				d2 = (xx - x2) * (xx - x2) + (yy - y2) * (yy - y2); 
				if(d0 < rr){
					if(d1 < rr){
						if(d2 < rr){
							drawing.putImageData(RGB(pixelData, 255, 255, 255), xx + 50, yy); 
						}
						else {
							drawing.putImageData(RGB(pixelData, 255, 255, 0), xx + 50, yy); 
						} 
					}
					else{
						if(d2 < rr){
							drawing.putImageData(RGB(pixelData, 255, 0, 255), xx + 50, yy); 
						} 
						else{
							drawing.putImageData(RGB(pixelData, 255, 0, 0), xx + 50, yy); 
						} 
					}
				}
				else{
					if(d1 < rr){
						if(d2 < rr){
							drawing.putImageData(RGB(pixelData, 0, 255, 255), xx + 50, yy); 
						}
						else {
							drawing.putImageData(RGB(pixelData, 0, 255, 0), xx + 50, yy); 
						}
					}
					else {
						if(d2 < rr) {
							drawing.putImageData(RGB(pixelData, 0, 0, 255), xx + 50, yy); 
						}
					} 
				}
			}
		}
        // drawing.fillText("三原色混合效果图。", 10, 10); 
	}
	
	function drawInTag_7 () {
		//生成立方体的图像空间算法
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"), 
            drawing = canvas.getContext("2d"), 
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////// / 	
		var pn = [
				node(-1, 0, 0, -1.4, 0, 0), 
				node(0, -1, 0, -1.4, 0, 0), 
				node(0, 0, -1, -1.4, 0, 0), 
				node(1, 0, 0, 0.6, 2, 2), 
				node(0, 1, 0, 0.6, 2, 2), 
				node(0, 0, 1, 0.6, 2, 2)
			], 
            tl, tu, dx, dy, dz, wx, wy, wz, nx, ny, nz, NDOTD, NDOTW, tt, 
            Lx, Ly, Lz, Vx, Vy, Vz, kpa, kpd, kps, 
            rpa, rpd, rps, nn, 
            xs, ys, x0, y0, z0, sb, tb, 
            vx0, vy0, vz0, hx0, hy0, hz0, lx0, ly0, lz0, ss, NdotL, NdotH,
            i, j, k, a; 
        
        nn = 5; 
		Lx = 8.0; Ly = 8.0; Lz = 8.0; Vx = 6.0; Vy = 6.0; Vz = 12.0; 
		kpa = kpd = 0.15; kps = 0.8; rpa = 555; rpd = 300; rps = 555; a = 0; 
	

		var xmin = -3.0, 
			xmax = 3.0, 
			xtp = 0.01, 
			ymin = -3.0, 
			ymax = 3.0, 
			ytp = 0.01; 
		
		for(xs = xmin; xs <=  xmax; xs +=xtp){
			for(ys = ymin; ys <=  ymax; ys +=ytp){
				tl = 0.0; 
				tu = 9999.9; 
				dx = xs - Vx; 
				dy = ys - Vy; 
				dz = -Vz; 
				k = 0; 
				for(i = 0; i < 6; i++){
					wx = Vx - pn[i].fx; 
					wy = Vy - pn[i].fy; 
					wz = Vz - pn[i].fz; 
					nx = pn[i].nx; 
					ny = pn[i].ny; 
					nz = pn[i].nz; 				
					NDOTD = nx * dx + ny * dy + nz * dz; 
					NDOTW = nx * wx + ny * wy + nz * wz; 
					if(Math.abs(NDOTD) < 0.01){
						if(NDOTW > 0.0) {
							k = 1; 
							break; 
						}
					}
					else{
						tt = -NDOTW / NDOTD; 
						if(NDOTD < 0.0){
							if(tt > tl){
								j = i; 
								tl = tt; 
							}
						}
						else if(tt < tu){
							tu = tt; 
						}
					}
					if(tl > tu) {
						k = 1; 
						break; 
					}
				}
				if(k){
					continue; 
				}
				x0 = Vx + (xs - Vx) * tl; 
				y0 = Vy + (ys - Vy) * tl; 
				z0 = Vz - Vz * tl; 
				nx = pn[j].nx; 
				ny = pn[j].ny; 
				nz = pn[j].nz; 
				lx0 = Lx - x0; 
				ly0 = Ly - y0; 
				lz0 = Lz - z0; 
				ss = Math.sqrt(lx0 * lx0 + ly0 * ly0 + lz0 * lz0); 
				lx0 = lx0 / ss; 
				ly0 = ly0 / ss; 
				lz0 = lz0 / ss; 	
				NdotL = lx0 * nx + ly0 * ny + lz0 * nz; 
				vx0 = Vx - x0; 
				vy0 = Vy - y0; 
				vz0 = Vz - z0; 
				ss = Math.sqrt(vx0 * vx0 + vy0 * vy0 + vz0 * vz0); 
				vx0 = vx0 / ss; 
				vy0 = vy0 / ss; 
				vz0 = vz0 / ss; 
				hx0 = lx0 + vx0; 
				hy0 = ly0 + vy0; 
				hz0 = lz0 + vz0; 
				ss = Math.sqrt(hx0 * hx0 + hy0 * hy0 + hz0 * hz0); 
				hx0 = hx0 / ss; 
				hy0 = hy0 / ss; 
				hz0 = hz0 / ss; 
				NdotH = nx * hx0 + ny * hy0 + nz * hz0; 
				tt = 1.0; 
				for(k = 0; k < nn; k++){
					tt = tt * NdotH; 
				}
				a = parseInt(1.4 * (kpa * rpa + kpd * rpd * NdotL + kps * rps * tt)); 
				drawing.putImageData(RGB(pixelData, a, 0, a), 400 + 100 * xs, 200 + 100 * ys); 
			}
		}

		// drawing.fillText("生成立方体的图像空间算法", 10, 10); 
		
		
	}
	function drawInTag_8 () {
        //纺锤体 色锥
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////// / 	
		
		var x, y, z, u, v, w, yr, pi, x2, y2, y5, y6, theta, alpha, //定义了运算中的变量
            x0 = 0, y0 = 100, x4 = 221, y4 = -140, x3 = -221, y3 = -140, //运算中的常量
            a, b, c; //颜色值获取变量
            
		pi = Math.PI; 
		theta = -2;      //透视视图变换分量
		alpha = -3.15;   //平面视图变换分量
		xmin = -2, ymin = -2, xmax = 2, ymax = 2; 
        
		for(u = 0; u <= 1; u+= 0.001){
			for(v = 0; v <= 1; v+= 0.001){
				x = (1-v) * Math.cos(2 * pi * u); 
				y = (1-v) * Math.sin(2 * pi * u); 
				z = 2.3 * v;   //Z轴变换公式
				yr = y * Math.cos(theta)+z * Math.sin(theta); 
				y2 = y * Math.cos(theta)-z * Math.sin(theta); 
				y5 = y * Math.cos(alpha)+z * Math.sin(alpha); 
				y6 = y * Math.cos(alpha)-z * Math.sin(alpha); 
				//对各个点的颜色值通过对定点进行距离运算求得
				a = -(1.4 - Math.sqrt(
					(x0 * (1 - v) - x * 255) * (x0 * (1 - v) - x * 255) + 
                    (y0 * (1 - v) - yr * 255) * (y0 * (1 - v) - yr * 255))
                ); 
				b = -(1.4 - Math.sqrt(
					(x4 * (1 - v) - x * 255) * (x4 * (1 - v) - x * 255) + 
                    (y4 * (1 - v) - yr * 255) * (y4 * (1 - v) - yr * 255))
                ); 
				c = -(1.4 - Math.sqrt(
					(x3 * (1 - v) - x * 255) * (x3 * (1 - v) - x * 255) +
                    (y3 * (1 - v) - yr * 255) * (y3 * (1 - v) - yr * 255))
                ); 
				//显示颜色纺锤体顶视图
				drawing.putImageData(
					RGB(
						pixelData, 
						parseInt(a * 0.48), 
						parseInt(b * 0.48), 
						parseInt(c * 0.48)
					), 
					x * 100 + 200, 
					y * 100 + 150); 
				//显示颜色纺锤体底视图
				drawing.putImageData(
					RGB(
						pixelData, 
						parseInt(a * (1 - v) * 0.48), 
						parseInt(b * (1 - v) * 0.48), 
						parseInt(c * (1 - v) * 0.48)
					), 
					x * 100+200, 
					y5 * 100+360); 
				//显示颜色纺锤体底部
				drawing.putImageData(
					RGB(
						pixelData, 
						parseInt(a * (1 - v) * 0.48), 
						parseInt(b * (1 - v) * 0.48), 
						parseInt(c * (1 - v) * 0.48)
					), 
					x * 100 + 500, 
					y2 * 100 + 240); 
				//显示颜色纺锤体上部分
				drawing.putImageData(
					RGB(
						pixelData, 
						a * 0.48, 
						b * 0.48, 
						c * 0.48
					), 
					x * 100 + 500, 
					yr * 100 + 240); 
			
			}
		}
        // drawing.fillText("纺锤体 色锥", 10, 10); 
	}
	function drawInTag_9 () {
        //圆锥体
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 
		//////////////////////////////////////////// / 
		var pi, rr, uu, n0x, n0y, n0z, x0, y0, z0, ss, tt, vx0, vy0, vz0, lx0, ly0, lz0, NdotL, NdotH,
            a, Lx, Ly, Lz, Vx, Vy, Vz, kpa, kpd, kps, rpa, rpd, rps, hx0, hy0, hz0,
            xt, ys, dx, dy, dz, ex, ey, ez, bb, cc, cx, cy, cz,
            k, nn, alf; 
		
		pi = Math.PI; 
		alf = pi / 3.0; 
		Lx = 50.0; Ly = 50.0; Lz = 50.0; ex = Vx = 5.0; ey = Vy = 5.0; ez = Vz = 10.0; 
		kpa = kpd = 0.15; kps = 0.8; rpa = 250; rpd = 250; rps = 250; 
		nn = 4; a = 0; cx = 0.0; cy = 0.0; cz = 0.0; 
		rr = 1.0; 
		xmin = -2.0; xmax = 2.0; ymin = -2.0; ymax = 2.0; 
		for(tt = 0.0; tt < 1.0; tt +=0.0045){
		    for(xt = 0.0; xt <=  2.0 * pi; xt +=0.0045){
				x0 = rr * (1.0 - tt) * Math.cos(xt); 
				y0 = rr * (1.0 - tt) * Math.sin(xt); 
				z0 = 2.0 * tt; 
				n0x = 2.0 * Math.cos(xt); 
				n0y = 2.0 * Math.sin(xt); 
				n0z = rr; 
				ss = Math.sqrt(n0x * n0x + n0y * n0y + n0z * n0z); 
				n0x = n0x / ss; 
				n0y = n0y / ss; 
				n0z = n0z / ss; 
				vx0 = Vx-x0; 
				vy0 = Vy-y0; 
				vz0 = Vz-z0; 
				ss = Math.sqrt(vx0 * vx0 + vy0 * vy0 + vz0 * vz0); 
				vx0 = vx0 / ss; 
				vy0 = vy0 / ss; 
				vz0 = vz0 / ss; 
				lx0 = Lx - x0; 
				ly0 = Ly - y0; 
				lz0 = Lz - z0; 
				ss = Math.sqrt(lx0 * lx0 + ly0 * ly0 + lz0 * lz0); 
				lx0 = lx0 / ss; 
				ly0 = ly0 / ss; 
				lz0 = lz0 / ss; 
				NdotL = lx0 * n0x + ly0 * n0y + lz0 * n0z; 
				hx0 = lx0 + vx0; 
				hy0 = ly0 + vy0; 
				hz0 = lz0 + vz0; 
				ss = Math.sqrt(hx0 * hx0 + hy0 * hy0 + hz0 * hz0); 
				hx0 = hx0 / ss; 
				hy0 = hy0 / ss; 
				hz0 = hz0 / ss; 
				NdotH = n0x * hx0 + n0y * hy0 + n0z * hz0; 
				ss = 1.0; 
				for(k = 0; k < nn; k++){
					ss = ss * NdotH; 
				}
				a = parseInt(kpa * rpa + kpd * rpd * NdotL + kps * rps * ss); 
				y0 = y0 * Math.cos(alf) - z0 * Math.sin(alf); 
				drawing.putImageData(RGB(pixelData, a, a, a), xwtov(x0) - 50, ywtov(y0) - 50); 
			}
		}
        // drawing.fillText("圆锥体", 10, 10); 
	}
	
	function drawInTag_10 () {
		//纹理+光照 真实感球体
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////////////
		
		var xt, fi, u, v, rr, dt, n0x, n0y, n0z, x0, y0, z0, 
            ss, tt, vx0, vy0, vz0, lx0, ly0, lz0, NdotL, NdotH,
            a, Lx, Ly, Lz, Vx, Vy, Vz, kpa, kpd, kps, rpa, rpd, rps, hx0, hy0, hz0,
            xs, ys, dx, dy, dz, ex, ey, ez, bb, cc, cx, cy, cz,
            k, nn; 
            
		Lx = 50.0; Ly = 50.0; Lz = 50.0; ex = Vx = 0.0; ey = Vy = 0.0; ez = Vz = 100.0; 
		kpa = kpd = 0.15; kps = 0.8; rpa = 200; rpd = 200; rps = 200; nn = 4; a = 0; cx = 0.0; 
		cy = 0.0; cz = 0.0; rr = 1.3; 
		xmin = -2.0; xmax = 2.0; ymin = -2.0; ymax = 2.0; 
		
		for(ys = ymax; ys >=  ymin; ys -= 3e-003){
			for(xs = xmin; xs <=  xmax; xs +=5e-003){
				dx = xs-ex; 
				dy = ys-ey; 
				dz = -ez; 
				tt = Math.sqrt(dx * dx + dy * dy + dz * dz); 
				dx = dx / tt; 
				dy = dy / tt; 
				dz = dz / tt; 
				bb = dx * (ex - cx) + dy * (ey-cy) + dz * (ez - cz); 
				cc = (ex - cx) * (ex - cx) + (ey - cy) * (ey - cy) + (ez - cz) * (ez - cz) - rr * rr; 
				dt = bb * bb - cc; 
				if(dt < 0.0) {
					continue; 
				}
				tt = -bb - Math.sqrt(dt); 
				x0 = ex + dx * tt; 
				y0 = ey + tt * dy; 
				z0 = ez + dz * tt; 
				xt = Math.acos((y0 - cz) / rr); 
				fi = Math.acos((x0 - cx) / Math.sqrt(rr * rr - y0 * y0)); 
				if(z0 < 0.0){
					fi = 2.0 * Math.PI - fi; 
				} 
				u = xt / Math.PI; 
				v = fi / Math.PI; 
				tt = Math.sqrt((x0 - cx) * (x0 - cx) + (y0 - cy) * (y0 - cy) + (z0 - cz) * (z0 - cz)); 
				n0x = (x0 - cx) / tt; 
				n0y = (y0 - cy) / tt; 
				n0z = (z0 - cz) / tt; 
				vx0 = Vx-x0; 
				vy0 = Vy-y0; 
				vz0 = Vz-z0; 
				tt = Math.sqrt(vx0 * vx0 + vy0 * vy0 + vz0 * vz0); 
				vx0 = vx0 / tt; 
				vy0 = vy0 / tt; 
				vz0 = vz0 / tt; 
				lx0 = Lx-x0; 
				ly0 = Ly-y0; 
				lz0 = Lz-z0; 
				tt = Math.sqrt(lx0 * lx0 + ly0 * ly0 + lz0 * lz0); 
				lx0 = lx0 / tt; 
				ly0 = ly0 / tt; 
				lz0 = lz0 / tt; 
				NdotL = lx0 * n0x + ly0 * n0y + lz0 * n0z; 
				hx0 = lx0 + vx0; 
				hy0 = ly0 + vy0; 
				hz0 = lz0 + vz0; 
				ss = Math.sqrt(hx0 * hx0 + hy0 * hy0 + hz0 * hz0); 
				hx0 = hx0 / ss; 
				hy0 = hy0 / ss; 
				hz0 = hz0 / ss; 
				NdotH = n0x * hx0 + n0y * hy0 + n0z * hz0; 
				tt = 1.0; 
				for(k = 0; k < nn; k++) {
					tt = tt * NdotH; 
				}
				a = parseInt(kpa * rpa + kpd * rpd * NdotL + kps * rps * tt); 
				if(Texture2(u, v)){
					drawing.putImageData(RGB(pixelData, a, 0, 0), xwtov(x0), ywtov(y0)); 
				}
				else {
					drawing.putImageData(RGB(pixelData, a, a, 0), xwtov(x0), ywtov(y0)); 
				}
			}
		}
        // drawing.fillText("纹理+光照 真实感球体", 10, 10); 
	}

	function drawInTag_11 () {
		//RGB颜色立方体沿对角线投影得到的正六边形投影图
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 
		//////////////////////////////////// / 
		
		var pi, xt, n0x, n0y, n0z, x0, y0, z0, ss, tt, vx0, vy0, vz0, lx0, ly0, lz0,
            a, Lx, Ly, Lz, Vx, Vy, Vz, kpa, kpd, kps, rpa, rpd, rps, hx0, hy0, hz0, NdotL, NdotH,
            xs, ys, dx, dy, dz, ex, ey, ez, cx, cy, cz, t1, t2,
            c1x, c1y, c1z, r1, c2x, c2y, c2z, r2,
            i, k, nn,
            j0, j1, j2, j3,
            sb, tb, xb, yb;
            
		var mm = [
				vectorNode(0, 3, 2, 1, 0, -1, 0), 
				vectorNode(0, 3, 7, 4, 0, 0, -1), 
				vectorNode(0, 4, 5, 1, -1, 0, 0), 
				vectorNode(6, 2, 3, 7, 1, 0, 0), 
				vectorNode(6, 7, 4, 5, 0, 1, 0), 
				vectorNode(6, 5, 1, 2, 0, 0, 1)
			]; //立方体六面和法向量。
			
		var pt = [
				cubeNode(0, 0, 0), 
				cubeNode(0, 0, 1), 
				cubeNode(1, 0, 1), 
				cubeNode(1, 0, 0), 
				cubeNode(0, 1, 0), 
				cubeNode(0, 1, 1), 
				cubeNode(1, 1, 1), 
				cubeNode(1, 1, 0)
			]; //立方体八个顶点坐标。

		xmin = -0.5; xmax = 1.0; ymin = -0.5; ymax = 1.0; 
		Vx = 15.0; Vy = 15.0; Vz = 15.0; 
        
		for(i = 3; i < 6; i++){
			j0 = mm[i].i0; 
			j1 = mm[i].i1; 
			j2 = mm[i].i2; 
			j3 = mm[i].i3; 
			for(sb = 0.0; sb <=  1.0; sb +=2e-003){
				for(tb = 0.0; tb <=  1.0; tb +=2e-003){
					x0 = (1.0 - sb) * (1.0 - tb) * pt[j0].x + 
                        sb * (1.0 - tb) * pt[j1].x + 
                        (1.0 - sb) * tb * pt[j3].x + 
                        sb * tb * pt[j2].x; 
					y0 = (1.0 - sb) * (1.0 - tb) * pt[j0].y + 
                        sb * (1.0 - tb) * pt[j1].y + 
                        (1.0 - sb) * tb * pt[j3].y + 
                        sb * tb * pt[j2].y; 
					z0 = (1.0 - sb) * (1.0 - tb) * pt[j0].z + 
                        sb * (1.0 - tb) * pt[j1].z + 
                        (1.0 - sb) * tb * pt[j3].z + 
                        sb * tb * pt[j2].z; 
					tt = Math.sqrt(6.0); 
					xt = Math.sqrt(2.0); 
					xb = (x0 + y0 - 2.0 * z0) / tt; 
					yb = (y0 - x0) / xt; 
					drawing.putImageData(
						RGB(pixelData, 255.0 * x0, 255.0 * y0, 255.0 * z0), 
						xwtov(xb) + 50, 
						ywtov(yb) - 50
					); 	
				}			
			}
		}
        // drawing.fillText("RGB颜色立方体沿对角线投影得到的正六边形投影图", 10, 10); 
	}
	function drawInTag_12() {
		//显示七个基本颜色长条，每个亮度从最暗道最亮。
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////////////////// / 
		var i, j; 

		for(i = 0; i < 256; i++){
			for(j = 20; j <= 70; j++) {
				drawing.putImageData(RGB(pixelData , i, 0, 0), 100 + i, j); 
			}
			for(j = 80; j <= 130; j++) {
				drawing.putImageData(RGB(pixelData, 0, i, 0), 100 + i, j); 
			}
			for(j = 140; j <= 190; j++) {
				drawing.putImageData(RGB(pixelData, 0, 0, i), 100 + i, j); 
			}
			for(j = 200; j <= 250; j++) {
				drawing.putImageData(RGB(pixelData, i, i, 0), 100 + i, j); 
			}
			for(j = 260; j <= 310; j++) {
				drawing.putImageData(RGB(pixelData, i, 0, i), 100 + i, j); 
			}
			for(j = 320; j <= 370; j++) {
				drawing.putImageData(RGB(pixelData, 0, i, i), 100 + i, j); 
			}
			for(j = 380; j <= 430; j++) {
				drawing.putImageData(RGB(pixelData, i, i, i), 100 + i, j); 
			}
		}
        // drawing.fillText("显示七个基本颜色长条", 10, 10); 
	}
	
	function drawInTag_13() {
		//亮度差值
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////////////////// / 
        var x1, x2, x3, y1, y2, y3, i1, i2, i3,
            xx, t, yy, ii,
            r,s;
            
         x1 = 0; y1 = 0; x2 = 2.25; y2 = 0; x3 = 1.27; y3 = 2.21; i1 = 0; i2 = 80; i3 = 255; 
        for(r = 0.0; r <=  1.0; r += 0.001) {
            for(s = 0.0; s <=  1.0 - r; s += 0.001){
                 t = 1.0 - r - s; 
                 xx = r * x1 + s * x2 + t * x3; 
                 yy = r * y1 + s * y2 + t * y3; 
                 ii = r * i1 + s * i2 + t * i3; 
                 drawing.putImageData(RGB(pixelData , 0, ii, 0), 100 + 100 * xx, 150 + 100 * yy); 
            }       
        }
        var img = new Image(); 
        // drawing.fillText("亮度差值", 10, 10); 
	}
	
    function  drawInTag_14 () {
        //纹理贴图
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1),
            img = new Image(); 
        img.src = 'texture1.jpg'; 
		////////////////////////////////////////// / 
        drawing.drawImage(img, 0, 0, 250, 250); 
        
		
		var xt, fi, u, v, rr, dt, n0x, n0y, n0z, x0, y0, z0, ss, 
            tt, vx0, vy0, vz0, lx0, ly0, lz0, NdotL, NdotH,
            r, g, b, Lx, Ly, Lz, Vx, Vy, Vz, kpa, kpd, kps, rpa, rpd, rps, hx0, hy0, hz0,
            xs, ys, dx, dy, dz, ex, ey, ez, bb, cc, cx, cy, cz,
            k, nn; 
            
		Lx = 50.0; Ly = 50.0; Lz = 50.0; ex = Vx = 0.0; ey = Vy = 0.0; ez = Vz = 100.0; 
		kpa = kpd = 0.15; kps = 1.8; rpa = 200; rpd = 200; rps = 200; nn = 5; a = 0; cx = 0.0; 
		cy = 0.0; cz = 0.0; rr = 1.3; 
		xmin = -2.0; xmax = 2.0; ymin = -2.0; ymax = 2.0; 
		
		for(ys = ymax; ys >=  ymin; ys -= 3e-003){
			for(xs = xmin; xs <=  xmax; xs +=5e-003){
				dx = xs-ex; 
				dy = ys-ey; 
				dz = -ez; 
				tt = Math.sqrt(dx * dx + dy * dy + dz * dz); 
				dx = dx / tt; 
				dy = dy / tt; 
				dz = dz / tt; 
				bb = dx * (ex - cx) + dy * (ey-cy) + dz * (ez - cz); 
				cc = (ex - cx) * (ex - cx) + (ey - cy) * (ey - cy) + (ez - cz) * (ez - cz) - rr * rr; 
				dt = bb * bb - cc; 
				if(dt < 0.0) {
					continue; 
				}
				tt = -bb - Math.sqrt(dt); 
				x0 = ex + dx * tt; 
				y0 = ey + tt * dy; 
				z0 = ez + dz * tt; 
				xt = Math.acos((y0 - cz) / rr); 
				fi = Math.acos((x0 - cx) / Math.sqrt(rr * rr - y0 * y0)); 
				if(z0 < 0.0){
					fi = 2.0 * Math.PI - fi; 
				} 
				u = xt / Math.PI; 
				v = fi / Math.PI; 
				tt = Math.sqrt((x0 - cx) * (x0 - cx) + (y0 - cy) * (y0 - cy) + (z0 - cz) * (z0 - cz)); 
				n0x = (x0 - cx) / tt; 
				n0y = (y0 - cy) / tt; 
				n0z = (z0 - cz) / tt; 
				vx0 = Vx-x0; 
				vy0 = Vy-y0; 
				vz0 = Vz-z0; 
				tt = Math.sqrt(vx0 * vx0 + vy0 * vy0 + vz0 * vz0); 
				vx0 = vx0 / tt; 
				vy0 = vy0 / tt; 
				vz0 = vz0 / tt; 
				lx0 = Lx-x0; 
				ly0 = Ly-y0; 
				lz0 = Lz-z0; 
				tt = Math.sqrt(lx0 * lx0 + ly0 * ly0 + lz0 * lz0); 
				lx0 = lx0 / tt; 
				ly0 = ly0 / tt; 
				lz0 = lz0 / tt; 
				NdotL = lx0 * n0x + ly0 * n0y + lz0 * n0z; 
				hx0 = lx0 + vx0; 
				hy0 = ly0 + vy0; 
				hz0 = lz0 + vz0; 
				ss = Math.sqrt(hx0 * hx0 + hy0 * hy0 + hz0 * hz0); 
				hx0 = hx0 / ss; 
				hy0 = hy0 / ss; 
				hz0 = hz0 / ss; 
				NdotH = n0x * hx0 + n0y * hy0 + n0z * hz0; 
				tt = 1.0; 
				for(k = 0; k < nn; k++) {
					tt = tt * NdotH; 
				}
                var currentPixel = drawing.getImageData(checkCoordinateU(u), checkCoordinateV(v), 1, 1); 
                
				r = parseInt(kpa * rpa + kps * rps * tt + currentPixel.data[0] * 1.4); 
				g = parseInt(kpa * rpa + kps * rps * tt + currentPixel.data[1] * 1.4); 
				b = parseInt(kpa * rpa + kps * rps * tt + currentPixel.data[2] * 1.4); 
                drawing.putImageData(
                    RGB(pixelData, r / 3, g / 3, b / 3), 
                    xwtov(x0) + 100, 
                    ywtov(y0) + 100
                ); 
			}
		}
        // drawing.fillText("材质贴图", 500, 50); 
        
    }
    
    function drawInTag_15 () {
      
        $("#canvasArea").empty().append(
            '<canvas id="canvas_tag" width="900" height="550"></canvas>'
        ); 
		var canvas = document.getElementById("canvas_tag"),
            drawing = canvas.getContext("2d"),
            pixelData = drawing.createImageData(1, 1); 
		////////////////////////////////////////// / 
        
        var p = [], 
            q0 = [], 
            q1 = [], 
            q2 = [], 
            q3 = []; 
        $.get("m34.off", function (data) {
            
            var meshArray = data.split(/[\s*]/),
                nverts, nfaces, nedges,
                i; 
            
            nverts = meshArray[2]; 
            nfaces = meshArray[3]; 
            nedges = meshArray[4]; 
            meshArray.splice(0, 6); 
            for(i = 0; i < nverts * 3; i +=3){
                p.push(meshNode(meshArray[i], meshArray[i + 1], meshArray[i + 2])); 
            }
            for(i; i < meshArray.length - 1; i +=5) {
                q0.push(meshArray[i]); 
                q1.push(meshArray[i + 1]); 
                q2.push(meshArray[i + 2]); 
                q3.push(meshArray[i + 3]); 
            }
            xmin = 0.0; xmax = 0.5; ymin = 0.0; ymax = 0.5; 
           for(i = 0; i < nfaces; i++){
                drawing.moveTo(dtxs_Mesh(p[q1[i]].x), dtys_Mesh(p[q1[i]].z)); 
                drawing.lineTo(dtxs_Mesh(p[q2[i]].x), dtys_Mesh(p[q2[i]].z)); 
                drawing.lineTo(dtxs_Mesh(p[q3[i]].x), dtys_Mesh(p[q3[i]].z)); 
                drawing.lineTo(dtxs_Mesh(p[q1[i]].x), dtys_Mesh(p[q1[i]].z)); 
                drawing.stroke(); 
           }
           for(i = 0; i < nverts; i++){
                drawing.putImageData(RGB(pixelData, 0, 0, 255), dtxs_Mesh(p[i].x), dtys_Mesh(p[i].z)); 
                drawing.putImageData(RGB(pixelData, 0, 0, 255), dtxs_Mesh(p[i].x) + 1, dtys_Mesh(p[i].z)); 
                drawing.putImageData(RGB(pixelData, 0, 0, 255), dtxs_Mesh(p[i].x), dtys_Mesh(p[i].z) + 1); 
                drawing.putImageData(RGB(pixelData, 0, 0, 255), dtxs_Mesh(p[i].x) + 1, dtys_Mesh(p[i].z) + 1); 
           }
        }); 
        // drawing.fillText("读取off文件创建大鸟模型", drawing.canvas.offsetWidth - 200, 50); 
    }

    //TODO show the list to menu

    function menuHandler () {
        
        var list = ""; 
        list +=" <div id  = 'drawInTag_1'> <a href = '#'>1.Draw Circle </a> </div>"; 
        list +=" <div id  = 'drawInTag_2'> <a href = '#'>2.Orthographic Views </a> </div>"; 
        list +=" <div id  = 'drawInTag_3'> <a href = '#'>3.Rotate Rectangle </a> </div>"; 
        list +=" <div id  = 'drawInTag_4'> <a href = '#'>4.Hermit curve </a> </div>"; 
        list +=" <div id  = 'drawInTag_5'> <a href = '#'>5.Different Faces Of Cube </a> </div>"; 
        list +=" <div id  = 'drawInTag_6'> <a href = '#'>6.Tricolor </a> </div>"; 
        list +=" <div id  = 'drawInTag_7'> <a href = '#'>7.Third Dimension Cube </a> </div>"; 
        list +=" <div id  = 'drawInTag_8'> <a href = '#'>8.Color Spindle </a> </div>"; 
        list +=" <div id  = 'drawInTag_9'> <a href = '#'>9.Third Dimension Cone </a> </div>"; 
        list +=" <div id  = 'drawInTag_10'> <a href = '#'>10.Texture+Lighting Sphere </a> </div>"; 
        list +=" <div id  = 'drawInTag_11'> <a href = '#'>11.RGB Cube Projection </a> </div>"; 
        list +=" <div id  = 'drawInTag_12'> <a href = '#'>12.RGB Color Line </a> </div>"; 
        list +=" <div id  = 'drawInTag_13'> <a href = '#'>13.D-value Of Illumination </a> </div>"; 
        list +=" <div id  = 'drawInTag_14'> <a href = '#'>14.Pinup Picture </a> </div>"; 
        list +=" <div id  = 'drawInTag_15'> <a href = '#'>15.Big Bird </a> </div>"; 
        $("#menu").html(list); 
    }
    
	$(document).ready(function (){
        var $canvas = $("#canvas_tag"); 
        
        menuHandler(); 
        $("#ajaxLoading").hide(); 
        $("#menuLabel").click(function () {
            $("#menu").slideToggle(); 
        }); 
        $("a").each(function () {
            $(this).hover(
              function () {
                $(this).addClass("hover"); 
              }, 
              function () {
                $(this).removeClass("hover"); 
              }

            ); 
        }); 
        $("#drawInTag_1").click(function (){
            drawInTag_1(); //画圆            
        }); 
        $("#drawInTag_2").click(function (){
            drawInTag_2(); //三视图           
        }); 
        $("#drawInTag_3").click(function (){
            drawInTag_3(); //矩形旋转体          
        }); 
        $("#drawInTag_4").click(function (){
            drawInTag_4(); //太极          
        }); 
        $("#drawInTag_5").click(function (){
            drawInTag_5(); //立方体六个面          
        }); 
        $("#drawInTag_6").click(function (){
            drawInTag_6(); //三原色           
        }); 
        $("#drawInTag_7").click(function (){
            drawInTag_7(); //真实感立方体           
        });  
        $("#drawInTag_8").click(function (){
            drawInTag_8(); //颜色纺锤体          
        }); 
        $("#drawInTag_9").click(function (){
            drawInTag_9(); //真实感圆锥体           
        }); 
        $("#drawInTag_10").click(function (){
            drawInTag_10(); //纹理+光照 真实感球体            
        }); 
        $("#drawInTag_11").click(function (){
            $("#canvas_tag").empty(); 
            drawInTag_11(); //RGB正六边形投影            
        }); 
        $("#drawInTag_12").click(function (){
            drawInTag_12(); //七色彩条           
        }); 
        $("#drawInTag_13").click(function (){
            drawInTag_13(); //亮度差值           
        }); 
        $("#drawInTag_14").click(function (){
            drawInTag_14(); //材质贴图        
        }); 
        $("#drawInTag_15").click(function (){
            drawInTag_15(); //读取off文件创建大鸟模型
        }); 
        
	}); 
}()); 