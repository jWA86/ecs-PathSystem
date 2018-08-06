(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("gl-matrix"), require("ecs-framework"));
	else if(typeof define === 'function' && define.amd)
		define(["gl-matrix", "ecs-framework"], factory);
	else if(typeof exports === 'object')
		exports["ecs-path"] = factory(require("gl-matrix"), require("ecs-framework"));
	else
		root["ecs-path"] = factory(root["gl-matrix"], root["ecs-framework"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(0);
var BezierUtil_1 = __webpack_require__(4);
var config_1 = __webpack_require__(3);
var pathType;
(function (pathType) {
    pathType[pathType["polyline"] = 0] = "polyline";
    pathType[pathType["cubicBezier"] = 1] = "cubicBezier";
})(pathType || (pathType = {}));
exports.pathType = pathType;
var PathComponent = /** @class */ (function () {
    function PathComponent(entityId, active, type, firstPtId, nbPt, length) {
        this.entityId = entityId;
        this.active = active;
        this.type = type;
        this.firstPtId = firstPtId;
        this.nbPt = nbPt;
        this.length = length;
    }
    return PathComponent;
}());
exports.PathComponent = PathComponent;
var computeLength = function (points, type, precision) {
    if (precision === void 0) { precision = config_1.L_PRECISION; }
    if (type === pathType.polyline) {
        return polyLineLength(points);
    }
    else if (type === pathType.cubicBezier) {
        return cubicBezierLength(points, precision);
    }
};
exports.computeLength = computeLength;
var polyLineLength = function (points) {
    if (points.length < 2) {
        return 0;
    }
    var length = 0;
    for (var i = 1; i < points.length; ++i) {
        length += gl_matrix_1.vec2.distance(points[i - 1], points[i]);
    }
    return length;
};
var cubicBezierLength = function (points, precision) {
    if (points.length < 4) {
        return 0;
    }
    return BezierUtil_1.cubicBezierUtil.lengthByLineInterpolation(points[0], points[1], points[2], points[3], precision);
};
var getPointAt = function (t, points, type, length) {
    if (type === pathType.cubicBezier) {
        return BezierUtil_1.cubicBezierUtil.getPointAt(t, points[0], points[1], points[2], points[3]);
    }
    else if (type === pathType.polyline) {
        return polyLineInterpolation(t, points, length);
    }
};
exports.getPointAt = getPointAt;
var polyLineInterpolation = function (t, points, pathLength) {
    var accumulatedDist = 0;
    for (var i = 0; i < points.length - 1; ++i) {
        var dist = gl_matrix_1.vec2.distance(points[i], points[i + 1]);
        accumulatedDist += dist;
        if (t <= (accumulatedDist / pathLength)) {
            var res = gl_matrix_1.vec2.create();
            return gl_matrix_1.vec2.lerp(res, points[i], points[i + 1], t);
        }
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DEBUG = { FILLSTYLE: "rgb(51, 204, 255)", STROKESTYLE: "rgb(0, 191, 255)", LINEWITH: 0.5, RADIUS: 2 };
exports.DEBUG = DEBUG;
// VECTOR
var X = 0;
exports.X = X;
var Y = 1;
exports.Y = Y;
// MATRIX
var SCALE_X = 0;
exports.SCALE_X = SCALE_X;
var SCALE_Y = 5;
exports.SCALE_Y = SCALE_Y;
var SKEW_X = 1;
exports.SKEW_X = SKEW_X;
var SKEW_Y = 4;
exports.SKEW_Y = SKEW_Y;
var TRANSLATE_X = 12;
exports.TRANSLATE_X = TRANSLATE_X;
var TRANSLATE_Y = 13;
exports.TRANSLATE_Y = TRANSLATE_Y;
// TRACE
var BUFFER_NB_POINTS = 200;
exports.BUFFER_NB_POINTS = BUFFER_NB_POINTS;
var MIN_DIST_BTW_PTS = 20;
exports.MIN_DIST_BTW_PTS = MIN_DIST_BTW_PTS;
// LENGTH COMPUTATION
var L_PRECISION = 0.5;
exports.L_PRECISION = L_PRECISION;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(0);
var cubicBezierUtil = {
    getPointAt: function (t, p0, p1, p2, p3) {
        var u = 1 - t;
        var tt = t * t;
        var uu = u * u;
        var uuu = uu * u;
        var ttt = tt * t;
        var p = gl_matrix_1.vec2.create();
        // console.log(p0);
        gl_matrix_1.vec2.scale(p, p0, uuu);
        gl_matrix_1.vec2.scaleAndAdd(p, p, p1, 3 * uu * t);
        gl_matrix_1.vec2.scaleAndAdd(p, p, p2, 3 * u * tt);
        gl_matrix_1.vec2.scaleAndAdd(p, p, p3, ttt);
        return p;
    },
    // Slow
    lengthByLineInterpolation: function (p0, p1, p2, p3, precision) {
        var dt = precision / gl_matrix_1.vec2.distance(p0, p3);
        // console.log(dt);
        var length = 0;
        for (var t = dt; t < 1.0; t += dt) {
            var from = cubicBezierUtil.getPointAt(t - dt, p0, p1, p2, p3);
            var to = cubicBezierUtil.getPointAt(t, p0, p1, p2, p3);
            length += gl_matrix_1.vec2.distance(from, to);
        }
        return length;
    },
    trim: function (t0, t1, p0, p1, p2, p3, out) {
        // B(t) = (1−t)3 P1 + 3(1−t)2t P2 + 3(1−t)t2 P3 + t3 P4
        // t = 0 = first Point P1
        // t = 1 = last Point P4
        var u0 = 1.0 - t0;
        var u1 = 1.0 - t1;
        // p0' = (u0*u0*u0*p0
        // + (t0*u0*u0 + u0*t0*u0 + u0*u0*t0)*p1
        // + (t0*t0*u0 + u0*t0*t0 + t0*u0*t0)*p2
        // + t0*t0*t0*p3)
        var p0prime = gl_matrix_1.vec2.create();
        gl_matrix_1.vec2.scale(p0prime, p0, u0 * u0 * u0);
        gl_matrix_1.vec2.scaleAndAdd(p0prime, p0prime, p1, t0 * u0 * u0 + u0 * t0 * u0 + u0 * u0 * t0);
        gl_matrix_1.vec2.scaleAndAdd(p0prime, p0prime, p2, t0 * t0 * u0 + u0 * t0 * t0 + t0 * u0 * t0);
        gl_matrix_1.vec2.scaleAndAdd(p0prime, p0prime, p3, t0 * t0 * t0);
        // p1' = (u0*u0*u1*p0
        // + (t0*u0*u1 + u0*t0*u1 + u0*u0*t1)*p1
        // + (t0*t0*u1 + u0*t0*t1 + t0*u0*t1)*p2
        // + t0*t0*t1*p3)
        var p1prime = gl_matrix_1.vec2.create();
        gl_matrix_1.vec2.scale(p1prime, p0, u0 * u0 * u1);
        gl_matrix_1.vec2.scaleAndAdd(p1prime, p1prime, p1, t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1);
        gl_matrix_1.vec2.scaleAndAdd(p1prime, p1prime, p2, t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1);
        gl_matrix_1.vec2.scaleAndAdd(p1prime, p1prime, p3, t0 * t0 * t1);
        // p2' (u0*u1*u1*p0
        // + (t0*u1*u1 + u0*t1*u1 + u0*u1*t1)*p1
        // + (t0*t1*u1 + u0*t1*t1 + t0*u1*t1)*p2
        // + t0*t1*t1*p3)
        var p2prime = gl_matrix_1.vec2.create();
        gl_matrix_1.vec2.scale(p2prime, p0, u0 * u1 * u1);
        gl_matrix_1.vec2.scaleAndAdd(p2prime, p2prime, p1, t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1);
        gl_matrix_1.vec2.scaleAndAdd(p2prime, p2prime, p2, t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1);
        gl_matrix_1.vec2.scaleAndAdd(p2prime, p2prime, p3, t0 * t1 * t1);
        // p3' = (u1*u1*u1*p1
        // + (t1*u1*u1 + u1*t1*u1 + u1*u1*t1)*p2
        // + (t1*t1*u1 + u1*t1*t1 + t1*u1*t1)*p3
        // + t1*t1*t1*p4)
        var p3prime = gl_matrix_1.vec2.create();
        gl_matrix_1.vec2.scale(p3prime, p0, u1 * u1 * u1);
        gl_matrix_1.vec2.scaleAndAdd(p3prime, p3prime, p1, t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1);
        gl_matrix_1.vec2.scaleAndAdd(p3prime, p3prime, p2, t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1);
        gl_matrix_1.vec2.scaleAndAdd(p3prime, p3prime, p3, t1 * t1 * t1);
        out[0] = p0prime;
        out[1] = p1prime;
        out[2] = p2prime;
        out[3] = p3prime;
    },
};
exports.cubicBezierUtil = cubicBezierUtil;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(2);
var gl_matrix_1 = __webpack_require__(0);
var BezierUtil_1 = __webpack_require__(4);
var PathComponent_1 = __webpack_require__(1);
var PointComponent_1 = __webpack_require__(7);
// Handle CRUD operations on PathComponentPool and PointComponentPool
var PathEntityFactory = /** @class */ (function () {
    /**
     * @param pointPoolSize size of the point component pool to be created if no pool are provided
     * @param pathPoolSize size of the path component pool to be created if no pool are provided
     * @param pointPool point component pool to be used by the PathEntityFactory for creating points of a path
     * @param pathPool path component pool to be used by the PathEntityFactory for creating path component
     */
    function PathEntityFactory(pointPoolSize, pathPoolSize, pointPool, pathPool) {
        var _this = this;
        this.getPointAt = function (t, path) {
            var points = [];
            // case fromIndex is undefined ?
            var fromIndex = _this.getFirstPointIndex(path);
            for (var i = fromIndex; i < fromIndex + path.nbPt; ++i) {
                points.push(_this.pointPool.values[i].point);
            }
            return PathComponent_1.getPointAt(t, points, path.type, path.length);
        };
        this.trimPath = function (path, trimFrom, trimTo, out) {
            if (trimFrom === void 0) { trimFrom = 0; }
            if (trimTo === void 0) { trimTo = 0; }
            var firstPtIndex = _this.getFirstPointIndex(path);
            var pool = _this.pointPool.values;
            switch (path.type) {
                case PathComponent_1.pathType.cubicBezier:
                    BezierUtil_1.cubicBezierUtil.trim(trimFrom, trimTo, pool[firstPtIndex].point, pool[firstPtIndex + 1].point, pool[firstPtIndex + 2].point, pool[firstPtIndex + 3].point, out);
                    break;
                case PathComponent_1.pathType.polyline:
                    _this.trimPolyline(path, trimFrom, trimTo, out);
                    break;
                default:
                    break;
            }
        };
        this.trimPolyline = function (path, trimFrom, trimTo, out) {
            if (trimFrom === void 0) { trimFrom = 0; }
            if (trimTo === void 0) { trimTo = 0; }
            var firstPtIndex = _this.getFirstPointIndex(path);
            var pool = _this.pointPool.values;
            var accumulatedDist = 0;
            var l = firstPtIndex + path.nbPt;
            for (var i = firstPtIndex + 1; i < l; ++i) {
                var dist = gl_matrix_1.vec2.dist(pool[i - 1].point, pool[i].point);
                accumulatedDist += dist;
                var normCurrentPos = (accumulatedDist / path.length);
                // first point lerp
                if (out.length === 0 && (trimFrom <= normCurrentPos)) {
                    var pt0 = gl_matrix_1.vec2.create();
                    var segNormT = _this.normTRelativeToSegment(dist, path.length, trimFrom, normCurrentPos);
                    gl_matrix_1.vec2.lerp(pt0, pool[i - 1].point, pool[i].point, segNormT);
                    out.push(pt0);
                }
                if (trimTo <= normCurrentPos) {
                    // last point lerp
                    var pt = gl_matrix_1.vec2.create();
                    var segNormT = _this.normTRelativeToSegment(dist, path.length, trimTo, normCurrentPos);
                    gl_matrix_1.vec2.lerp(pt, pool[i - 1].point, pool[i].point, segNormT);
                    out.push(pt);
                    return;
                }
                if (out.length > 0 && trimTo > normCurrentPos) {
                    // intermediate point
                    out.push(pool[i].point);
                }
            }
        };
        this.pathPool = pathPool || new ecs_framework_1.ComponentFactory(pathPoolSize, new PathComponent_1.PathComponent(0, true, PathComponent_1.pathType.polyline, 0, 0, 0));
        this.pointPool = pointPool || new ecs_framework_1.ComponentFactory(pointPoolSize, new PointComponent_1.PointComponent(0, true, gl_matrix_1.vec2.fromValues(0.0, 0.0)));
    }
    PathEntityFactory.prototype.createPathComponent = function (entityId, firstPointId, nbPoints, type, active) {
        if (active === void 0) { active = true; }
        var c = this.pathPool.create(entityId, active);
        c.firstPtId = firstPointId;
        c.nbPt = nbPoints;
        c.type = type;
        this.setLength(c);
        return c;
    };
    PathEntityFactory.prototype.create = function (entityId, points, type) {
        if (points.length < 1) {
            throw Error("a path mush have at least 1 points");
        }
        var firstPointId = this.pointPool.nbCreated + 1;
        var l = points.length;
        for (var i = 0; i < l; ++i) {
            var p = this.pointPool.create(this.pointPool.nbCreated + 1, true);
            gl_matrix_1.vec2.copy(p.point, points[i]);
        }
        var c = this.pathPool.create(entityId, true);
        c.type = type;
        c.firstPtId = firstPointId;
        c.nbPt = l;
        c.length = PathComponent_1.computeLength(points, type);
        return c;
    };
    /**
     * Compute the length and set the length proprety of the component
     * @param path the path component to set the length to
     */
    PathEntityFactory.prototype.setLength = function (path) {
        var points = [];
        var from = this.pointPool.keys.get(path.firstPtId);
        if (from === undefined) {
            throw Error("first point id not found in the point pool");
        }
        for (var i = from; i < from + path.nbPt; ++i) {
            points.push(this.pointPool.values[i].point);
        }
        path.length = PathComponent_1.computeLength(points, path.type);
    };
    /**
     * Return a Path component from the pathComponent pool
     * @param entityId Path entity id
     */
    PathEntityFactory.prototype.getPathComponent = function (entityId) {
        return this.pathPool.get(entityId);
    };
    // should be a method of pool
    PathEntityFactory.prototype.getLastPathId = function () {
        if (this.pathPool.activeLength === 0) {
            return 0;
        }
        return this.pathPool.values[this.pathPool.activeLength - 1].entityId;
    };
    PathEntityFactory.prototype.getFirstPointIndex = function (path) {
        // throw error if undefined ?
        return this.pointPool.keys.get(path.firstPtId);
    };
    /**
     * Return the index in point values of the last point of a path
     * @param pathId
     */
    PathEntityFactory.prototype.getLastPointIndex = function (path) {
        var index = this.pointPool.keys.get(path.firstPtId);
        return index += path.nbPt;
    };
    PathEntityFactory.prototype.normTRelativeToSegment = function (segmentLenght, pathLength, normAbsPosition, normAbsEndSegment) {
        var normSegLength = segmentLenght / pathLength;
        return (normSegLength - (normAbsEndSegment - normAbsPosition)) / normSegLength;
    };
    return PathEntityFactory;
}());
exports.PathEntityFactory = PathEntityFactory;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CompoundPathComponent = /** @class */ (function () {
    function CompoundPathComponent(entityId, active, visible, firstPathId, nbPath, style, transform, trimFrom, trimTo, length) {
        this.entityId = entityId;
        this.active = active;
        this.visible = visible;
        this.firstPathId = firstPathId;
        this.nbPath = nbPath;
        this.style = style;
        this.transform = transform;
        this.trimFrom = trimFrom;
        this.trimTo = trimTo;
        this.length = length;
    }
    return CompoundPathComponent;
}());
exports.CompoundPathComponent = CompoundPathComponent;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PointComponent = /** @class */ (function () {
    function PointComponent(entityId, active, point) {
        this.entityId = entityId;
        this.active = active;
        this.point = point;
    }
    return PointComponent;
}());
exports.PointComponent = PointComponent;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(2);
var gl_matrix_1 = __webpack_require__(0);
var CONF = __webpack_require__(3);
var PathComponent_1 = __webpack_require__(1);
var defaultCompoundPathRendererParams = {
    firstPathId: 0,
    length: 0,
    nbPath: 0,
    style: { lineWidth: 1, strokeStyle: "black", lineCap: "square", lineJoin: "miter" },
    transform: gl_matrix_1.mat4.create(),
    trimFrom: 0,
    trimTo: 1,
};
var nbAfterComa = 10000;
var CompoundPathRendererSystem = /** @class */ (function (_super) {
    __extends(CompoundPathRendererSystem, _super);
    function CompoundPathRendererSystem(context, compoundPathEntityPool) {
        var _this = _super.call(this) || this;
        _this.context = context;
        _this.compoundPathEntityPool = compoundPathEntityPool;
        _this._defaultParameter = defaultCompoundPathRendererParams;
        return _this;
    }
    // iterate on a compoundPAth component
    // then iterate on all their paths
    // finally iterate on points for rendering
    CompoundPathRendererSystem.prototype.execute = function (params) {
        this.context.beginPath();
        // a	m11 : glM : m00 [0]
        // b	m12 : glM : m01 [1]
        // c	m21 : glM : m10 [4]
        // d	m22 : glM : m11 [5]
        // e	m41 : glM : m30 [12]
        // f	m42 : glM : m31 [13]
        var t = params.transform[this._k.transform];
        this.context.setTransform(t[CONF.SCALE_X], t[CONF.SKEW_X], t[CONF.SKEW_Y], t[CONF.SCALE_Y], t[CONF.TRANSLATE_X], t[CONF.TRANSLATE_Y]);
        // Iterate paths of the compoundPath Component
        var firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(params.firstPathId[this._k.firstPathId]);
        // const previousTrace = { point: undefined, type: pathType.polyline };
        var accumulatedLength = 0;
        var firstPathTraced = false;
        // const from = Math.floor(param6.length * param5.trim.from * nbAfterComa) / nbAfterComa;
        var from = params.length[this._k.length] * params.trimFrom[this._k.trimFrom];
        // const to = Math.floor(param6.length * param5.trim.to * nbAfterComa) / nbAfterComa;
        var to = params.length[this._k.length] * params.trimTo[this._k.trimTo];
        for (var i = firstPathIndex; i < firstPathIndex + params.nbPath[this._k.nbPath]; ++i) {
            var path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];
            accumulatedLength += path.length;
            if (accumulatedLength < from) {
                // When trim begin at a next path
                continue;
            }
            else if (accumulatedLength >= from && accumulatedLength <= to) {
                // When trim begin on this path but end on a next path. or end on this path because it's the last one
                var normFrom = this.normalFrom(accumulatedLength, path.length, from);
                var normTo = 1;
                this.trace(path, normFrom, normTo);
                firstPathTraced = true;
            }
            else if (accumulatedLength >= to && !firstPathTraced) {
                // When trim begin and end on the same path
                // from from the begining of this path in normalized form
                var normFrom = (from === 0) ? 0 : (from - path.length) / path.length;
                var normTo = (path.length - to) / path.length;
                this.trace(path, normFrom, normTo);
                firstPathTraced = true;
                break;
            }
            else if (accumulatedLength >= to && firstPathTraced) {
                // When trim begin on a previous path and end on this one
                var normFrom = 0;
                var normTo = 1 - (accumulatedLength - to) / path.length;
                this.trace(path, normFrom, normTo);
                break;
            }
        }
        this.context.lineWidth = params.style[this._k.style].lineWidth;
        this.context.lineCap = params.style[this._k.style].lineCap;
        this.context.strokeStyle = params.style[this._k.style].strokeStyle;
        this.context.lineJoin = params.style[this._k.style].lineJoin;
        this.context.stroke();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    };
    // To move to compoundEntityFactory (or pathEntityFactory ??)
    CompoundPathRendererSystem.prototype.normalFrom = function (accumulatedLength, pathLength, from) {
        if (from === 0) {
            return 0;
        }
        var l = (pathLength - (accumulatedLength - from)) / pathLength;
        return (l < 0) ? 0 : l;
    };
    CompoundPathRendererSystem.prototype.trace = function (path, trimFrom, trimTo) {
        switch (path.type) {
            case PathComponent_1.pathType.polyline:
                this.tracePolyLine(path, trimFrom, trimTo);
                break;
            case PathComponent_1.pathType.cubicBezier:
                this.traceCubicBezier(path, trimFrom, trimTo);
                break;
            default:
                break;
        }
    };
    /**
     * lineTo points of pathComponent
     */
    CompoundPathRendererSystem.prototype.tracePolyLine = function (path, trimFrom, trimTo) {
        if (trimFrom === void 0) { trimFrom = 0; }
        if (trimTo === void 0) { trimTo = 1; }
        if (trimFrom === 0 && trimTo === 1) {
            var firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.getFirstPointIndex(path);
            var pool = this.compoundPathEntityPool.pathEntityFactory.pointPool.values;
            var pt = pool[firstPtIndex].point;
            this.context.moveTo(pt[CONF.X], pt[CONF.Y]);
            for (var j = firstPtIndex + 1; j < firstPtIndex + path.nbPt; ++j) {
                pt = pool[j].point;
                this.context.lineTo(pt[CONF.X], pt[CONF.Y]);
            }
        }
        else {
            var out = [];
            this.compoundPathEntityPool.pathEntityFactory.trimPath(path, trimFrom, trimTo, out);
            this.context.moveTo(out[0][CONF.X], out[0][CONF.Y]);
            for (var j = 1; j < out.length; ++j) {
                this.context.lineTo(out[j][CONF.X], out[j][CONF.Y]);
            }
        }
    };
    CompoundPathRendererSystem.prototype.traceCubicBezier = function (path, trimFrom, trimTo) {
        if (trimFrom === void 0) { trimFrom = 0; }
        if (trimTo === void 0) { trimTo = 1; }
        // trim
        if (trimFrom !== 0 || trimTo !== 1) {
            var out = [];
            this.compoundPathEntityPool.pathEntityFactory.trimPath(path, trimFrom, trimTo, out);
            this.context.moveTo(out[0][CONF.X], out[0][CONF.Y]);
            this.context.bezierCurveTo(out[1][CONF.X], out[1][CONF.Y], out[2][CONF.X], out[2][CONF.Y], out[3][CONF.X], out[3][CONF.Y]);
        }
        else {
            // no trim
            // get points from factory,
            // move to first point
            // trace the bezier curve
            var firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.getFirstPointIndex(path);
            var pool = this.compoundPathEntityPool.pathEntityFactory.pointPool.values;
            var pt0 = pool[firstPtIndex].point;
            var pt1 = pool[firstPtIndex + 1].point;
            var pt2 = pool[firstPtIndex + 2].point;
            var pt3 = pool[firstPtIndex + 3].point;
            this.context.moveTo(pt0[CONF.X], pt0[CONF.Y]);
            this.context.bezierCurveTo(pt1[CONF.X], pt1[CONF.Y], pt2[CONF.X], pt2[CONF.Y], pt3[CONF.X], pt3[CONF.Y]);
        }
    };
    return CompoundPathRendererSystem;
}(ecs_framework_1.System));
exports.CompoundPathRendererSystem = CompoundPathRendererSystem;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BezierUtil_1 = __webpack_require__(4);
exports.cubicBezierUtil = BezierUtil_1.cubicBezierUtil;
var CompoundPathComponent_1 = __webpack_require__(6);
exports.CompoundPathComponent = CompoundPathComponent_1.CompoundPathComponent;
var CompoundPathEntityFactory_1 = __webpack_require__(11);
exports.CompoundPathEntityFactory = CompoundPathEntityFactory_1.CompoundPathEntityFactory;
var CompoundPathRenderSystem_1 = __webpack_require__(8);
exports.CompoundPathRendererSystem = CompoundPathRenderSystem_1.CompoundPathRendererSystem;
var DebugCompoundPathRenderSystem_1 = __webpack_require__(12);
exports.DebugCompoundPathRendererSystem = DebugCompoundPathRenderSystem_1.DebugCompoundPathRendererSystem;
var PathComponent_1 = __webpack_require__(1);
exports.computeLength = PathComponent_1.computeLength;
exports.getPointAt = PathComponent_1.getPointAt;
exports.PathComponent = PathComponent_1.PathComponent;
exports.pathType = PathComponent_1.pathType;
var PathEntityFactory_1 = __webpack_require__(5);
exports.PathEntityFactory = PathEntityFactory_1.PathEntityFactory;
var PointComponent_1 = __webpack_require__(7);
exports.PointComponent = PointComponent_1.PointComponent;
var SVGPath_1 = __webpack_require__(13);
exports.svgPathUtil = SVGPath_1.svgPathUtil;
var TracePathSystem_1 = __webpack_require__(14);
exports.MouseComponent = TracePathSystem_1.MouseComponent;
exports.TracePathSystem = TracePathSystem_1.TracePathSystem;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(2);
var CompoundPathComponent_1 = __webpack_require__(6);
var PathEntityFactory_1 = __webpack_require__(5);
var gl_matrix_1 = __webpack_require__(0);
var CompoundPathEntityFactory = /** @class */ (function () {
    function CompoundPathEntityFactory(compoundPathPoolSize, pathPoolSize, pointPoolSize, componentPool, pathEntityFactory, defaultStyle) {
        this.defaultStyle = { lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter" };
        this.defaultStyle = defaultStyle || this.defaultStyle;
        this.componentPool = componentPool || new ecs_framework_1.ComponentFactory(compoundPathPoolSize, new CompoundPathComponent_1.CompoundPathComponent(0, true, true, 0, 0, this.defaultStyle, gl_matrix_1.mat4.create(), 0, 1, 0));
        this.pathEntityFactory = pathEntityFactory || new PathEntityFactory_1.PathEntityFactory(pointPoolSize, pathPoolSize);
    }
    /**
     * Create an empty compound path component
     * @param {number} entityId Compound Path component id
     * @param {boolean} [visible=true] Set visibility
     * @param {boolean} [active=true]  Activate the component
     */
    CompoundPathEntityFactory.prototype.create = function (entityId, visible, style, active) {
        if (visible === void 0) { visible = true; }
        if (style === void 0) { style = this.defaultStyle; }
        if (active === void 0) { active = true; }
        var c = this.componentPool.create(entityId, active);
        c.visible = visible;
        // copy prop of style to the component
        Object.keys(style).forEach(function (k) {
            c.style[k] = style[k];
        });
        return c;
    };
    /** Create a CompoundPathComponent and copy PathComponents from an input pathEntityFactory and a list of PathComponents id
     * return a CompoundPathComponent
     * @param entityId
     * @param sourcePathFactory
     * @param pathIds
     * @param visible
     * @param active
     */
    CompoundPathEntityFactory.prototype.createFromPaths = function (entityId, sourcePathFactory, pathIds, visible, style, active) {
        if (visible === void 0) { visible = true; }
        if (style === void 0) { style = this.defaultStyle; }
        if (active === void 0) { active = true; }
        var beforeNbComp = this.pathEntityFactory.pathPool.nbCreated;
        // copy paths before creating new compoundPath component
        var fId = this.copyPaths(sourcePathFactory, pathIds);
        if (this.pathEntityFactory.pathPool.nbCreated - beforeNbComp !== pathIds.length) {
            throw Error("Not all paths component were copied");
        }
        var newCompound = this.create(entityId, visible, style, active);
        newCompound.firstPathId = fId;
        newCompound.nbPath = pathIds.length;
        this.setLenght(newCompound);
        return newCompound;
    };
    CompoundPathEntityFactory.prototype.setLenght = function (cPath) {
        var points = [];
        var fromIndex = this.pathEntityFactory.pathPool.keys.get(cPath.firstPathId);
        if (fromIndex === undefined) {
            throw Error("first point id not found in the point pool");
        }
        var l = [];
        var length = 0;
        for (var i = fromIndex; i < fromIndex + cPath.nbPath; ++i) {
            var p = this.pathEntityFactory.pathPool.values[i];
            length += p.length;
        }
        cPath.length = length;
    };
    // should be a method of the pool
    CompoundPathEntityFactory.prototype.getLastPathId = function () {
        if (this.componentPool.activeLength === 0) {
            return 0;
        }
        return this.componentPool.values[this.componentPool.activeLength - 1].entityId;
    };
    CompoundPathEntityFactory.prototype.getPointAt = function (t, cPath) {
        // t distance relative to the compoundPath lenght
        var tLength = t * cPath.length;
        var fromIndex = this.getFirstPathIndex(cPath);
        var accumulatedLength = 0;
        for (var i = fromIndex; i < fromIndex + cPath.nbPath; ++i) {
            var path = this.pathEntityFactory.pathPool.values[i];
            accumulatedLength += path.length;
            if (accumulatedLength >= tLength) {
                var pathStart = accumulatedLength - path.length;
                if (pathStart < tLength) {
                    // the point lies on a path
                    // normalized t relative to the pathLenght
                    var normT = Math.abs((tLength - pathStart) / path.length);
                    var res = this.pathEntityFactory.getPointAt(normT, path);
                    return res;
                }
            }
        }
    };
    CompoundPathEntityFactory.prototype.getFirstPathIndex = function (cPath) {
        return this.pathEntityFactory.pathPool.keys.get(cPath.firstPathId);
    };
    /** Copy paths components and their corresponding points from an inpute PathEntityFactory to the PathEntityFactory of the CompoundFactory
     * Return the pathId of the first path
     * @param inputPathFactory
     * @param pathId
     */
    CompoundPathEntityFactory.prototype.copyPaths = function (inputPathFactory, pathId) {
        var _this = this;
        // checking that list of path id provided exist before copy them
        pathId.forEach(function (id) {
            if (!inputPathFactory.pathPool.has(id)) {
                throw Error("some path id are incorrects");
            }
        });
        var firstPathId = this.pathEntityFactory.pathPool.nbCreated + 1;
        pathId.forEach(function (id) {
            // get the path from the buffer factory
            // iterate on the buffer points pool and copy points
            // create a new pathC
            // set firstPointId and nbPt on the newly created pathC
            var path = inputPathFactory.getPathComponent(id);
            var fromIndex = inputPathFactory.pointPool.keys.get(path.firstPtId);
            var firstPtId = _this.pathEntityFactory.pointPool.nbCreated + 1;
            var newId = firstPtId - 1;
            // copy points
            for (var i = fromIndex; i < fromIndex + path.nbPt; ++i) {
                newId += 1;
                var newPt = _this.pathEntityFactory.pointPool.create(newId, true);
                gl_matrix_1.vec2.copy(newPt.point, inputPathFactory.pointPool.values[i].point);
            }
            var copiedP = _this.pathEntityFactory.createPathComponent(_this.pathEntityFactory.getLastPathId() + 1, firstPtId, path.nbPt, path.type, path.active);
        });
        return firstPathId;
    };
    return CompoundPathEntityFactory;
}());
exports.CompoundPathEntityFactory = CompoundPathEntityFactory;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CONF = __webpack_require__(3);
var CompoundPathRenderSystem_1 = __webpack_require__(8);
/** Render all controls point of paths from a CompoundPath component */
var DebugCompoundPathRendererSystem = /** @class */ (function (_super) {
    __extends(DebugCompoundPathRendererSystem, _super);
    function DebugCompoundPathRendererSystem(context, compoundPathEntityPool, style) {
        if (style === void 0) { style = { radius: CONF.DEBUG.RADIUS, fillStyle: CONF.DEBUG.FILLSTYLE, lineWidth: CONF.DEBUG.LINEWITH, strokeStyle: CONF.DEBUG.STROKESTYLE }; }
        var _this = _super.call(this, context, compoundPathEntityPool) || this;
        _this.style = style;
        return _this;
    }
    DebugCompoundPathRendererSystem.prototype.execute = function (params) {
        // Iterate paths of the compoundPath Component
        var firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(params.firstPathId[this._k.firstPathId]);
        // a	m11 : glM : m00 [0]
        // b	m12 : glM : m01 [1]
        // c	m21 : glM : m10 [4]
        // d	m22 : glM : m11 [5]
        // e	m41 : glM : m30 [12]
        // f	m42 : glM : m31 [13]
        var t = params.transform[this._k.transform];
        this.context.setTransform(t[CONF.SCALE_X], t[CONF.SKEW_X], t[CONF.SKEW_Y], t[CONF.SCALE_Y], t[CONF.TRANSLATE_X], t[CONF.TRANSLATE_Y]);
        for (var i = firstPathIndex; i < firstPathIndex + params.nbPath[this._k.nbPath]; ++i) {
            var path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];
            this.renderPoints(path);
        }
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    };
    DebugCompoundPathRendererSystem.prototype.renderPoints = function (path) {
        this.context.fillStyle = this.style.fillStyle;
        this.context.lineWidth = this.style.lineWidth;
        this.context.strokeStyle = this.style.strokeStyle;
        var firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.pointPool.keys.get(path.firstPtId);
        var pt;
        for (var j = firstPtIndex; j < firstPtIndex + path.nbPt; ++j) {
            pt = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[j].point;
            this.context.beginPath();
            this.context.arc(pt[CONF.X], pt[CONF.Y], this.style.radius, 0, 2 * Math.PI, false);
            this.context.fill();
            this.context.stroke();
        }
        return pt;
    };
    return DebugCompoundPathRendererSystem;
}(CompoundPathRenderSystem_1.CompoundPathRendererSystem));
exports.DebugCompoundPathRendererSystem = DebugCompoundPathRendererSystem;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = __webpack_require__(0);
var PathComponent_1 = __webpack_require__(1);
var svgPathUtil = {
    /**
     * Create a CompoundEntity from a svg path
     * @param entityId the enityId to give to the entity to be created
     * @param svgPath the svgPath in string format
     * @param compoundFactory the CompoundEntityFactory use for creating the compound entity
     */
    parseSVGPath: function (entityId, svgPath, compoundFactory) {
        // every c or C or M = a new cubic bezier path
        // since we record 4 points for each cubic bezier we need record the last point of the previous path as the first of the new path
        // once we have the 4 points coordinates
        // create a new path
        // at the end create a compoindPath which refer to the created path
        var commands = svgPath.split(/(?=c|C|M|m)/g);
        var points = [];
        // Split the string so we have all elements in a array
        var firstPathId = compoundFactory.pathEntityFactory.getLastPathId() + 1;
        var nbPath = 0;
        var referencePoint = gl_matrix_1.vec2.create();
        commands.forEach(function (command, index) {
            command = command.trim();
            switch (command.charAt(0)) {
                case "M":
                    svgPathUtil.parseM(command, referencePoint, points);
                    break;
                case "C":
                    if (index === 0) {
                        return Error("A path can't begin with a C command");
                    }
                    svgPathUtil.parseC(command, referencePoint, points);
                    createCubicBezierComponent(points);
                    nbPath += 1;
                    break;
                case "c":
                    svgPathUtil.parseC(command, referencePoint, points);
                    createCubicBezierComponent(points);
                    nbPath += 1;
                    break;
                default:
                    return Error("Parsing of this command is not implemented : " + command);
            }
        });
        // Remove the first poitns since we copy the previous points for every C command but the first command is a M command.
        points.shift();
        // create the compoundPath and add reference to the paths
        function createCubicBezierComponent(pts) {
            var id = compoundFactory.pathEntityFactory.getLastPathId() + 1;
            var c = compoundFactory.pathEntityFactory.create(id, points.slice(-4), PathComponent_1.pathType.cubicBezier);
            return c;
        }
        // create the compoundPath and add reference to the paths
        var res = compoundFactory.create(entityId);
        res.firstPathId = firstPathId;
        res.nbPath = nbPath;
        compoundFactory.setLenght(res);
        return res;
    },
    /** Parse a Move command,
     *
     * Set the point as a reference for next path,
     * Point is pushed to the output array.
     * @param c
     * @param refVec
     * @param output
     */
    parseM: function (c, refVec, output) {
        // remove 'M'
        c = c.slice(1, c.length);
        var coord = c.split(",");
        var x = Number(coord[0]);
        var y = Number(coord[1]);
        if (x !== undefined && y !== undefined) {
            output.push(gl_matrix_1.vec2.fromValues(x, y));
            gl_matrix_1.vec2.copy(refVec, output[output.length - 1]);
        }
        else {
            throw Error("No readable coordinates on element : " + c);
        }
    },
    /** Parse a cubic bezier curve,
     * Set the last point as a reference for next path,
     * Points are pushed to the output array.
     * @param c
     * @param refVec
     * @param output
     */
    parseC: function (c, refVec, output) {
        var relative = c.charAt(0) === "c";
        // remove 'C' or 'c'
        c = c.slice(1, c.length);
        var curvePts = c.split(/(?=,|\-)/g);
        if (curvePts.length === 6) {
            for (var i = 0; i < 6; i += 2) {
                var x = Number(curvePts[i].replace(/^,/, ""));
                var y = Number(curvePts[i + 1].replace(/^,/, ""));
                if (relative) {
                    output.push(gl_matrix_1.vec2.fromValues(refVec[0] + x, refVec[1] + y));
                }
                else {
                    output.push(gl_matrix_1.vec2.fromValues(x, y));
                }
                // last point would serve as a reference point for the next path
                if (i === 4) {
                    gl_matrix_1.vec2.copy(refVec, output[output.length - 1]);
                }
                else if (i === 0) {
                    gl_matrix_1.vec2.copy(refVec, output[output.length - 1]);
                }
            }
        }
        else {
            throw Error("C, Cubic bezier element need 3 points : " + c);
        }
    },
};
exports.svgPathUtil = svgPathUtil;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(2);
var gl_matrix_1 = __webpack_require__(0);
// import { distance } from "gl-matrix/src/gl-matrix/vec2";
var config_1 = __webpack_require__(3);
var PathComponent_1 = __webpack_require__(1);
var PathEntityFactory_1 = __webpack_require__(5);
var MouseComponent = /** @class */ (function () {
    function MouseComponent(entityId, active, position, pressed) {
        this.entityId = entityId;
        this.active = active;
        this.position = position;
        this.pressed = pressed;
    }
    return MouseComponent;
}());
exports.MouseComponent = MouseComponent;
// record mouse input as a polyline path in a buffer pool
// when the mouse is release the polyline is copied to the destination buffer
// it then can be converted to  a bezier curve
var TracePathSystem = /** @class */ (function (_super) {
    __extends(TracePathSystem, _super);
    function TracePathSystem(input, destionationFactory, minDistanceBtwPts, bufferNbPoints) {
        if (minDistanceBtwPts === void 0) { minDistanceBtwPts = config_1.MIN_DIST_BTW_PTS; }
        if (bufferNbPoints === void 0) { bufferNbPoints = config_1.BUFFER_NB_POINTS; }
        var _this = _super.call(this) || this;
        _this.input = input;
        _this.destionationFactory = destionationFactory;
        _this.minDistanceBtwPts = minDistanceBtwPts;
        _this._defaultParameter = {};
        _this._resizeWhenFreeSlotLeft = 20;
        _this._parameters = {};
        _this.bufferFactory = new PathEntityFactory_1.PathEntityFactory(config_1.BUFFER_NB_POINTS, 2);
        _this.currentState = { currentPtId: 0, action: "NAN" };
        return _this;
    }
    Object.defineProperty(TracePathSystem.prototype, "resizeWhenFreeSlotLeft", {
        get: function () {
            return this._resizeWhenFreeSlotLeft;
        },
        set: function (val) {
            this._resizeWhenFreeSlotLeft = val;
        },
        enumerable: true,
        configurable: true
    });
    TracePathSystem.prototype.resetBufferPath = function () {
        this.bufferPath = this.bufferFactory.create(1, [], PathComponent_1.pathType.polyline);
    };
    TracePathSystem.prototype.process = function () {
        if (this.currentState.currentPtId > 0 && this.currentState.action === "DRAWING") {
            // continue adding point
            if (this.input.pressed) {
                // don't save same position point
                var prevPoint = this.bufferFactory.pointPool.get(this.currentState.currentPtId).point;
                if (gl_matrix_1.vec2.distance(prevPoint, this.input.position) < this.minDistanceBtwPts) {
                    return;
                }
                resizePoolIfNotEnoughtSpace(this.bufferFactory.pointPool, this._resizeWhenFreeSlotLeft);
                this.currentState.currentPtId += 1;
                var newPt = this.bufferFactory.pointPool.create(this.currentState.currentPtId, true);
                gl_matrix_1.vec2.copy(newPt.point, this.input.position);
                this.bufferPath.nbPt += 1;
            }
            else if (!this.input.pressed && this.currentState.action === "DRAWING") {
                // mouse released, end of recording
                // reset currentState
                this.currentState.action = "NAN";
                this.currentState.currentPtId = 0;
                // only keep path with nb point > 1
                if (this.bufferPath.nbPt > 1) {
                    // copy buffer point & sahpe to pointPool
                    this.moveBuffersToPool();
                }
                this.eraseBuffers();
            }
        }
        else if (this.currentState.action === "NAN" && this.input.pressed) {
            // create new path
            this.currentState.currentPtId += 1;
            this.currentState.action = "DRAWING";
            this.bufferPath = this.bufferFactory.create(this.currentState.currentPtId, [this.input.position], PathComponent_1.pathType.polyline);
            this.bufferPath.firstPtId = 1;
            this.bufferPath.nbPt = 1;
        }
    };
    TracePathSystem.prototype.moveBuffersToPool = function () {
        var pointPool = this.destionationFactory.pathEntityFactory.pointPool;
        resizePoolIfNotEnoughtSpace(pointPool, this.bufferFactory.pointPool.nbCreated * 3);
        var id = this.destionationFactory.getLastPathId() + 1;
        resizePoolIfNotEnoughtSpace(this.destionationFactory.componentPool, 10);
        resizePoolIfNotEnoughtSpace(this.destionationFactory.pathEntityFactory.pathPool, 10);
        this.destionationFactory.createFromPaths(id, this.bufferFactory, [1]);
    };
    TracePathSystem.prototype.eraseBuffers = function () {
        // free points
        var buffer = this.bufferFactory.pointPool;
        var l = buffer.activeLength;
        for (var i = l; i > -1; --i) {
            var id = buffer.values[i].entityId;
            buffer.free(id);
        }
        this.bufferPath.nbPt = 0;
    };
    TracePathSystem.prototype.execute = function () { };
    return TracePathSystem;
}(ecs_framework_1.System));
exports.TracePathSystem = TracePathSystem;
// should be part of a ComponentPool class
// behavior should be more transparent
var resizePoolIfNotEnoughtSpace = function (pool, nbFreeNeeded) {
    if (pool.nbFreeSlot < nbFreeNeeded) {
        var size = Math.floor(pool.size + (pool.size / 2));
        if (size < nbFreeNeeded) {
            size = nbFreeNeeded * 2;
        }
        pool.resizeTo(size);
    }
};


/***/ })
/******/ ]);
});