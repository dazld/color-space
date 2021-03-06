var s = typeof colorSpace !== 'undefined' ? colorSpace : require("../index");
var assert = require("assert");
var round = require('mumath').round;
var mult = require('mumath').mult;
var div = require('mumath').div;
var max = require('mumath').max;
var husl = require('husl');
var addSpace = require('../util/add-space');

//append extra spaces
addSpace(s, require('../xyy'));
addSpace(s, require('../labh'));
addSpace(s, require('../cmy'));


var createSpaceCase = typeof createSpaceCase !== 'undefined' ? createSpaceCase : function(){};


//Check values here:
// http://www.easyrgb.com/index.php?X=CALC#Result
// http://colormine.org/convert/luv-to-rgb


//these two are basic spaces
createSpaceCase('RGB');


//TODO: save hue on zero-saturation
describe('hsl', function(){
	before(function(){
		createSpaceCase('HSL');
	});

	it('hsl → rgb', function(){
		assert.deepEqual(round(s.hsl.rgb([96, 48, 59])), [140, 201, 100]);
	});
	it('hsl → hsv', function(){
		// colorpicker says [96,50,79]
		assert.deepEqual(round(s.hsl.hsv([96, 48, 59])), [96, 50, 79]);
	});
	it('hsl → cmyk', function(){
		assert.deepEqual(round(s.hsl.cmyk([96, 48, 59])), [30, 0, 50, 21]);
	});
	it('rgb → hsl', function(){
		assert.deepEqual(round(s.rgb.hsl([140, 200, 100])), [96, 48, 59]);
	});
});


describe('hsv', function(){
	before(function(){
		createSpaceCase('HSV');
	});

	it('hsv → rgb', function(){
		assert.deepEqual(round(s.hsv.rgb([96, 50, 78])), [139, 199, 99]);
	});
	it('hsv → hsl', function(){
		assert.deepEqual(round(s.hsv.hsl([96, 50, 78])), [96, 47, 59]);
		assert.deepEqual(round(s.hsv.hsl([0,0,0])), [0,0,0]);
	});
	it('hsv → cmyk', function(){
		assert.deepEqual(round(s.hsv.cmyk([96, 50, 78])), [30, 0, 50, 22]);
	});
	it('rgb → hsv', function(){
		assert.deepEqual(round(s.rgb.hsv([140, 200, 100])), [96, 50, 78]);
	});
});


describe('hwb', function(){
	before(function(){
		createSpaceCase('HWB');
		createSpaceCase('HSL');
	});

	it('hwb → rgb', function(){
		// hwb
		// http://dev.w3.org/csswg/css-color/#hwb-examples

		// all extrem value should give black, white or grey
		for(var angle = 0; angle <= 360; angle ++) {
		  assert.deepEqual(round(s.hwb.rgb([angle, 0, 100])), [0, 0, 0]);
		  assert.deepEqual(round(s.hwb.rgb([angle, 100, 0])), [255, 255, 255]);
		  assert.deepEqual(round(s.hwb.rgb([angle, 100, 100])), [128, 128, 128]);
		}

		assert.deepEqual(round(s.hwb.rgb([0, 0, 0])), [255,0,0]);
		assert.deepEqual(round(s.hwb.rgb([0, 20, 40])), [153, 51, 51]);
		assert.deepEqual(round(s.hwb.rgb([0, 40, 40])), [153, 102, 102]);
		assert.deepEqual(round(s.hwb.rgb([0, 40, 20])), [204, 102, 102]);

		assert.deepEqual(round(s.hwb.rgb([120, 0, 0])), [0,255,0]);
		assert.deepEqual(round(s.hwb.rgb([120, 20, 40])), [51, 153, 51]);
		assert.deepEqual(round(s.hwb.rgb([120, 40, 40])), [102, 153, 102]);
		assert.deepEqual(round(s.hwb.rgb([120, 40, 20])), [102, 204, 102]);

		assert.deepEqual(round(s.hwb.rgb([240, 0, 0])), [0,0,255]);
		assert.deepEqual(round(s.hwb.rgb([240, 20, 40])), [51, 51, 153]);
		assert.deepEqual(round(s.hwb.rgb([240, 40, 40])), [102, 102, 153]);
		assert.deepEqual(round(s.hwb.rgb([240, 40, 20])), [102, 102, 204]);
	});

	it('rgb → hwb', function(){
		assert.deepEqual(round(s.rgb.hwb([140, 200, 100])), [96, 39, 22]);
	});

	it('hsv → hwb', function(){
		assert.deepEqual(round(s.hsv.hwb([10, 100, 0])), [10, 0, 100]);
		assert.deepEqual(round(s.hsv.hwb([20, 0, 0])), [20, 0, 100]);
		assert.deepEqual(round(s.hsv.hwb([30, 0, 100])), [30, 100, 0]);
		assert.deepEqual(round(s.hsv.hwb([40, 0, 100])), [40, 100, 0]);
		assert.deepEqual(round(s.hsv.hwb([96, 50, 78])), [96, 39, 22]);
	});

	it('hwb → hsv', function(){
		assert.deepEqual(round(s.hwb.hsv([0, 50, 100])), [0, 0, 33]);
		assert.deepEqual(round(s.hwb.hsv([0, 100, 50])), [0, 0, 67]);
		assert.deepEqual(round(s.hwb.hsv([96, 39, 22])), [96, 50, 78]);
		assert.deepEqual(round(s.hwb.hsv([20, 100, 0])), [20, 0, 100]);
		assert.deepEqual(round(s.hwb.hsv([20, 0, 0])), [20, 100, 100]);

		assert.deepEqual(round(s.hwb.hsv([2, 50, 50])), [2, 0, 50]);
		assert.deepEqual(round(s.hwb.hsv([2, 90, 90])), [2, 0, 50]);
		assert.deepEqual(round(s.hwb.hsv([2, 100, 100])), [2, 0, 50]);
		assert.deepEqual(round(s.hwb.hsv([0, 0, 100])), [0, 0, 0]);
		assert.deepEqual(round(s.hwb.hsv([0, 50, 50])), [0, 0, 50]);
		assert.deepEqual(round(s.hwb.hsv([0, 50, 100])), [0, 0, 33]);

	});

	it('hwb → hsl', function(){
		assert.deepEqual(round(s.hwb.hsl([20, 50, 50])), [20, 0, 50]);
		assert.deepEqual(round(s.hwb.hsl([20, 100, 100])), [20, 0, 50]);
		assert.deepEqual(round(s.hwb.hsl([20, 100, 100])), [20, 0, 50]);
	});

	it('hsl → hwb', function(){
		assert.deepEqual(round(s.hsl.hwb([20, 100, 0])), [20, 0, 100]);
		assert.deepEqual(round(s.hsl.hwb([20, 100, 50])), [20, 0, 0]);
		assert.deepEqual(round(s.hsl.hwb([20, 0, 50])), [20, 50, 50]);
		assert.deepEqual(round(s.hsl.hwb([20, 50, 100])), [20, 100, 0]);
		assert.deepEqual(round(s.hsl.hwb([96, 48, 59])), [96, 39, 21]);
	});
});


describe('cmyk', function(){
	before(function(){
		createSpaceCase('CMYK');
	});

	it('rgb → cmyk', function(){
		assert.deepEqual(round(s.rgb.cmyk([140, 200, 100])), [30, 0, 50, 22]);
		assert.deepEqual(round(s.rgb.cmyk([0,0,0,1])), [0,0,0,100]);
	});

	it('cmyk → rgb', function(){
		assert.deepEqual(round(s.cmyk.rgb([30, 0, 50, 22])), [139, 199, 99]);
	});
	it('cmyk → hsl', function(){
		assert.deepEqual(round(s.cmyk.hsl([30, 0, 50, 22])), [96, 47, 59]);
	});
	it('cmyk → hsv', function(){
		assert.deepEqual(round(s.cmyk.hsv([30, 0, 50, 22])), [96, 50, 78]);
	});
	// it('cmyk → hwb', function(){
	// 	assert.deepEqual(round(s.cmyk.hwb([30, 0, 50, 22])), [96, 39, 22]);
	// });
});


describe('xyz', function(){
	before(function(){
		createSpaceCase('XYZ');
	});

	//TODO: more tests here
	it('xyz → rgb', function(){
		assert.deepEqual(round(s.xyz.rgb([25, 40, 15])), [97, 190, 85]);
		assert.deepEqual(round(s.xyz.rgb([50, 100, 100])), [0, 255, 241]);
	});
	it('xyz → lab', function(){
		assert.deepEqual(round(s.xyz.lab([25, 40, 15])), [69, -48, 44]);
	});
	it('xyz → lchab', function(){
		assert.deepEqual(round(s.xyz.lchab([25, 40, 15])), [69, 65, 137]);
	});
	it('rgb → xyz', function(){
		assert.deepEqual(round(s.rgb.xyz([92, 191, 84])), [25, 40, 15]);
	});
});


describe('xyY', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('xyY');
	});

	//TODO: more tests here
	it('xyz → xyy', function(){
		assert.deepEqual(round(s.xyz.xyy([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.xyz.xyy([25, 40, 15]), .01), [.31, .5, 40]);
		assert.deepEqual(round(s.xyz.xyy([50, 100, 100]), .01), [0.2, .4, 100]);
	});
	it('xyy → xyz', function(){
		assert.deepEqual(round(s.xyy.xyz([.40, .15, 25]), .1), [66.7, 25, 75]);
	});
});


describe('hunter-lab', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('LABh');
	});

	it('rgb → labh', function(){
		assert.deepEqual(round(s.rgb.labh([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.rgb.labh([10, 0, 0]), .1), [2.5, 4.3, 1.6]);
		assert.deepEqual(round(s.rgb.labh([100, 0, 0]), .1), [16.5, 28.2, 10.6]);
		assert.deepEqual(round(s.rgb.labh([255, 0, 0]), .1), [46.1, 78.9, 29.8]);
		assert.deepEqual(round(s.rgb.labh([0, 255, 0]), .1), [84.6, -72.5, 50.8]);
		assert.deepEqual(round(s.rgb.labh([0, 0, 255]), .1), [26.9, 72.9, -190.9]);
		assert.deepEqual(round(s.rgb.labh([0, 255, 255]), .1), [88.7, -47, -9.4]);
		assert.deepEqual(round(s.rgb.labh([255, 255, 255]), .1), [100, -5.3, 5.4]);
	});

	it('labh → rgb', function(){
		assert.deepEqual(round(s.labh.rgb([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.labh.rgb([1, 10, -10])), [4, 0, 6]);
		assert.deepEqual(round(s.labh.rgb([10, 100, -100])), [92, 0, 121]);
	});

	it('xyz → labh', function(){
		assert.deepEqual(round(s.xyz.labh([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.xyz.labh([95, 100, 108])), [100, -5, 6]);
		assert.deepEqual(round(s.xyz.labh([95, 100, 0])), [100, -5, 70]);
	});

	it('labh → xyz', function(){
		assert.deepEqual(round(s.labh.xyz([0, 0, 0])), [0, 0, 0]);
	});
});


describe('lab', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('LAB');
	});

	it('lab → xyz', function(){
		assert.deepEqual(round(s.lab.xyz([69, -48, 44])), [25, 39, 15]);
	});
	it('lab → rgb', function(){
		assert.deepEqual(round(s.lab.rgb([75, 20, -30])), [194, 175, 240]);
	});
	it('lab → lchab', function(){
		assert.deepEqual(round(s.lab.lchab([69, -48, 44])), [69, 65, 137]);
	});
	it('rgb → lab', function(){
		assert.deepEqual(round(s.rgb.lab([92, 191, 84])), [70, -50, 45]);
	});
});


describe('lchab', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('LCHab');
	});

	it('lchab → lab', function(){
		assert.deepEqual(round(s.lchab.lab([69, 65, 137])), [69, -48, 44]);
	});
	it('lchab → xyz', function(){
		assert.deepEqual(round(s.lchab.xyz([69, 65, 137])), [25, 39, 15]);
	});
	it('lchab → rgb', function(){
		assert.deepEqual(round(s.lchab.rgb([69, 65, 137])), [98, 188, 83]);
	});
	it('rgb → lchab', function(){
		assert.deepEqual(round(s.rgb.lchab([92, 191, 84])), [70, 67, 138]);
	});
});


describe('luv', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('LUV');
	});

	it('rgb → luv', function(){
		assert.deepEqual(round(s.rgb.luv([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.rgb.luv([10, 0, 0])), [1, 2, 0]);
		assert.deepEqual(round(s.rgb.luv([100, 0, 0])), [19, 62, 13]);
		assert.deepEqual(round(s.rgb.luv([255, 0, 0])), [53, 175, 38]);
		assert.deepEqual(round(s.rgb.luv([0, 255, 0])), [88, -83, 107]);
		assert.deepEqual(round(s.rgb.luv([0, 0, 255])), [32, -9, -130]);
		assert.deepEqual(round(s.rgb.luv([0, 255, 255])), [91, -70, -15]);
		assert.deepEqual(round(s.rgb.luv([255, 255, 255])), [100, 0, 0]);
	});

	it('luv → rgb', function(){
		assert.deepEqual(round(s.luv.rgb([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.luv.rgb([0, -134, -140])), [0, 0, 0]);
		assert.deepEqual(round(s.luv.rgb([90, 128, 100])), [255, 189, 0]);
		assert.deepEqual(round(s.luv.rgb([50, -134, 122])), [0, 159, 0]);
	});

	it('xyz → luv', function(){
		assert.deepEqual(round(s.xyz.luv([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.xyz.luv([95, 100, 100]),.1), [100, 3.5, 8.6]);
		assert.deepEqual(round(s.xyz.luv([50, 50, 50])), [76, 13, 5]);
		assert.deepEqual(round(s.xyz.luv([100, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.xyz.luv([0, 100, 0])), [100, -257, 171]);
		assert.deepEqual(round(s.xyz.luv([0, 0, 100])), [0, 0, 0]);
		assert.deepEqual(round(s.xyz.luv([95, 0, 100])), [0, 0, 0]);
	});

	it('luv → xyz', function(){
		assert.deepEqual(round(s.luv.xyz([0, 0, 0])), [0, 0, 0]);
		assert.deepEqual(round(s.luv.xyz([50, -50, -50])), [13, 18, 45]);
		assert.deepEqual(round(s.luv.xyz([50, 50, 50])), [21, 18, 2]);
	});
});


describe('lchuv', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('LCHuv');
	});

	it('luv ←→ lchuv', function(){
		assert.deepEqual(round(
			s.lchuv.luv(s.luv.lchuv([0, 0, 0]))), [0, 0, 0]);
		assert.deepEqual(round(
			s.lchuv.luv(s.luv.lchuv([50, -50, -50]))), [50, -50, -50]);
		assert.deepEqual(round(
			s.lchuv.luv(s.luv.lchuv([50, 50, 50]))), [50, 50, 50]);
		assert.deepEqual(round(
			s.lchuv.luv(s.luv.lchuv([100, 0, 0]))), [100, 0, 0]);
	});
});


describe('husl', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('HuSL');
	});

	it('_husl: lch → luv ≡ lchuv → luv', function(){
		assert.deepEqual(round(husl._conv.lch.luv([1,20,40]), .0001), round(s.lchuv.luv([1,20,40]), .0001));
		assert.deepEqual(round(husl._conv.lch.luv([21,50,40]), .0001), round(s.lchuv.luv([21,50,40]), .0001));
		assert.deepEqual(round(husl._conv.lch.luv([25,30,43]), .0001), round(s.lchuv.luv([25,30,43]), .0001));
	});

	it('_husl: luv → xyz ≡ luv → xyz ', function(){
		assert.deepEqual(round(mult(husl._conv.luv.xyz([21,50,40]), 100), .0001), round(s.luv.xyz([21,50,40]), .0001));
		assert.deepEqual(round(mult(husl._conv.luv.xyz([1,20,40]), 100), .0001), round(s.luv.xyz([1,20,40]), .0001));
		assert.deepEqual(round(mult(husl._conv.luv.xyz([25,30,43]), 100), .0001), round(s.luv.xyz([25,30,43]), .0001));
	});


	it('_husl: xyz → rgb ≡ xyz → rgb', function(){
		assert.deepEqual(
			round(
				max(mult(husl._conv.xyz.rgb(div([33,40,50], 100)), 255), 0), .0001
			),
			round(s.xyz.rgb([33,40,50]), .0001)
		);
		assert.deepEqual(
			round(
				max(mult(husl._conv.xyz.rgb(div([1,20,40], 100)), 255), 0), .0001
			),
			round(s.xyz.rgb([1,20,40]), .0001)
		);
		assert.deepEqual(
			round(
				max(mult(husl._conv.xyz.rgb(div([25,30,43], 100)), 255), 0), .0001
			),
			round(s.xyz.rgb([25,30,43]), .0001)
		);
	});


	it('_husl: lch → rgb ≡ lchuv → rgb', function(){
		assert.deepEqual(
			max(round(mult(husl._conv.lch.rgb([1,20,40]), 255), .001), 0),
			max(round(s.lchuv.rgb([1,20,40]), .001), 0)
		);
		assert.deepEqual(
			max(round(mult(husl._conv.lch.rgb([25,30,43]), 255), .001), 0),
			max(round(s.lchuv.rgb([25,30,43]), .001), 0)
		);
		assert.deepEqual(
			max(round(mult(husl._conv.lch.rgb([33,40,50]), 255), .001), 0),
			max(round(s.lchuv.rgb([33,40,50]), .001), 0)
		);
	});

	it('_husl → rgb ≡ husl → rgb', function(){
		assert.deepEqual(
			round(mult(husl.toRGB(25, 30, 43), 255)),
			round(s.husl.rgb([25, 30, 43]))
		);
	});
});


describe('huslp', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('HuSLP');
	});

	it('huslp → rgb', function(){

	});

	it('huslp → xyz', function(){

	});
});



describe.skip('ciecam', function(){
	before(function(){
		createSpaceCase('XYZ');
		createSpaceCase('ciecam');
	});

	it('to rgb', function(){

	});

	it('to xyz', function(){

	});

	it('to ', function(){

	});
});