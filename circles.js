class Circle {
    constructor(obj) {
        this.center = {
            x: obj.x || 0,
            y: obj.y || 0
        };
        this.radius = obj.radius || 1;
        this.id = obj.id || -1;
        this.isContainedInOtherCircle = false;
        this.intesectPoints = [];
    }

    addIntersectPoint(point) {
        this.intesectPoints.push(point);
    }

    getIntersectPoints() {
        return this.intesectPoints;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getCenter() {
        return this.center;
    }

    setCenter(center) {
        this.center = center;
    }

    getX() {
        return this.center.x;
    }

    getY() {
        return this.center.y;
    }

    getRadius() {
        return this.radius;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    isContained() {
        return this.isContainedInOtherCircle;
    }

    setIsContained() {
        let intesectPoints = this.getIntersectPoints();
        for (let i = 0; i < intesectPoints.length; i++) {
            intesectPoints[i].setIsRellevant(true);
        }

        this.isContainedInOtherCircle = true;
    }

    toString() {
        return {
            center: {
                a: this.getX(),
                b: this.getY()
            },
            radius: this.getRadius(),
            isContained: this.isContained(),
            arcs: this.getIntersectPoints(),
        }
    }
}

class Arc {
    constructor() {
        this.intersectCircles;
        this.angleFromTop = 0; // in degree
        this.angleFromCenter = 0;
        this.points; // array of two points, [0] - start point, [1] - end point
        this.isRellevant = true; // indicate if the arc is rellevant to show.
    }

    getPoints() {
        return this.points;
    }

    setPoints(points) {
        this.points = points;
    }

    getIsRellevant() {
        return this.isRellevant;
    }

    setIsRellevant(isRellevant) {
        this.isRellevant = isRellevant;
    }


    getAngleFromCenter() {
        return this.angleFromCenter;
    }

    setAngleFromCenter(angleFromCenter) {
        this.angleFromCenter = angleFromCenter;
    }

    getAngleFromTop() {
        return this.angleFromTop;
    }

    setAngleFromTop(angleFromTop) {
        this.angleFromTop = angleFromTop;
    }

    getIntersectCircles() {
        return this.intersectCircles;
    }

    setIntersectCircles(intersectCircles) {
        this.intersectCircles = intersectCircles;
    }

    toString() {
        let circles = this.getIntersectCircles();
        return {
            intersectCircles: [circles[0].getId(), circles[1].getId()],
            points: {
                point1: {
                    x: this.getPoints()[0].x,
                    y: this.getPoints()[0].y
                },
                point2: {
                    x: this.getPoints()[1].x,
                    y: this.getPoints()[1].y
                }
            },
            angleFromCenter: this.getAngleFromCenter(),
            angleFromTop: this.getAngleFromTop(),
            isRellevant: this.getIsRellevant(),
        }
    }
}

function a() {
    let log = "";
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    function createRandomCircle(id) {
        let obj = {
            x: 50 + Math.random() * 300,
            y: 25 + Math.random() * 300,
            radius: Math.random() * 150,
            id: id
        };
        return new Circle(obj);
    }

    const NUMBER_OF_CIRCLES = 2;
    let circles = [];

    for (let i = 0; i < NUMBER_OF_CIRCLES; i++) {
        circles.push(createRandomCircle(i));
    }

    circles = [];

    let obj = {
        x: 300,
        y: 300,
        radius: 80,
        id: 1
    };

    let obj1 = {
        x: 350,
        y: 300,
        radius: 40,
        id: 2
    };

    circles.push(new Circle(obj));
    circles.push(new Circle(obj1));


    function intersection(circle0, circle1) {
        //link https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
        let x0 = circle0.getX(),
            y0 = circle0.getY(),
            r0 = circle0.getRadius(),

            x1 = circle1.getX(),
            y1 = circle1.getY(),
            r1 = circle1.getRadius();


        var a, dx, dy, d, h, rx, ry;
        var x2, y2;

        /* dx and dy are the vertical and horizontal distances between
         * the circle centers.
         */
        dx = x1 - x0;
        dy = y1 - y0;

        /* Determine the straight-line distance between the centers. */
        d = Math.sqrt((dy * dy) + (dx * dx));

        /* Check for solvability. */
        if (d > (r0 + r1)) {
            /* no solution. circles do not intersect. */
            return "no solution. circles do not intersect.";
        }
        if (d < Math.abs(r0 - r1)) {
            /* no solution. one circle is contained in the other */
            if (r0 < r1) {
                circle0.setIsContained();
            }
            else {
                circle1.setIsContained();
            }
            return "no solution. one circle is contained in the other";
        }
        if (d === 0 || (r0 === r1 && x0 === x1 && y0 === y1)) {
            /* same circles */
            return "same circles";
        }

        /* 'point 2' is the point where the line through the circle
         * intersection points crosses the line between the circle
         * centers.
         */

        /* Determine the distance from point 0 to point 2. */
        a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

        /* Determine the coordinates of point 2. */
        x2 = x0 + (dx * a / d);
        y2 = y0 + (dy * a / d);

        /* Determine the distance from point 2 to either of the
         * intersection points.
         */
        h = Math.sqrt((r0 * r0) - (a * a));

        /* Now determine the offsets of the intersection points from
         * point 2.
         */
        rx = -dy * (h / d);
        ry = dx * (h / d);

        // if the center of one of the circles is in the other circles.
        //than one of the circle's arc has an angle over 180
        let isAngleIsOverPI = false;
        let bigestRadius = Math.max(r0, r1);
        if (d < bigestRadius) {
            let bigCenterX = x0, bigCenterY = y1;
            if (bigestRadius === r1) {
                bigCenterX = x1;
                bigCenterY = y1;
            }

            let deltaPoint2x = bigCenterX - x2,
                deltaPoint2y = bigCenterY - y2;

            let distP2BigestCircle = Math.sqrt((deltaPoint2x * deltaPoint2x) + (deltaPoint2y * deltaPoint2y));

            if (distP2BigestCircle > d) {
                isAngleIsOverPI = true;
            }
        }

        /* Determine the absolute intersection points. */
        var xi = x2 + rx;
        var xi_prime = x2 - rx;
        var yi = y2 + ry;
        var yi_prime = y2 - ry;

        let point0 = {
                x: xi,
                y: yi
            },
            point1 = {
                x: xi_prime,
                y: yi_prime
            };

        // keep the order of the arc point, when circle1 is right to the circle0 then the order is correct,
        // but if it is the other way around then we need to switch

        return {
            points: [point0, point1],
            isAngleOverPI: isAngleIsOverPI
        };
    }


    function drawCirclesIntesectPoints(circlesArray) {
        ctx.fillStyle = "#FF0000";
        ctx.strokeStyle = "#00FF00";

        for (let i = 0; i < circlesArray.length; i++) {
            if (!circlesArray[i].isContained()) {

                let arcs = circlesArray[i].getIntersectPoints();
                for (let j = 0; j < arcs.length; j++) {
                    if (arcs[j].getIsRellevant()) {
                        let arcPoints = arcs[j].getPoints();

                        ctx.fillRect(arcPoints[0].x, arcPoints[0].y, 2, 2);
                        ctx.fillRect(arcPoints[1].x, arcPoints[1].y, 2, 2);

                        ctx.beginPath();
                        // -90 because canvas circle 0 is a three o'clock,
                        let startangle = arcs[j].getAngleFromTop() - 90;
                        let endangle = startangle + arcs[j].getAngleFromCenter();

                        ctx.arc(
                            circlesArray[i].getX(),
                            circlesArray[i].getY(),
                            circlesArray[i].getRadius(),
                            startangle / 180 * Math.PI,
                            endangle / 180 * Math.PI);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    /*function calcAngleOfArc(point1, point2, radius) {

     let angle = calcIsoscelesTrianangleAngle(point1, point2, radius);

     let dy = -1,dx = -1;
     if (dy < 0 || dx < 0) {
     alpha += Math.PI;
     }
     return alpha / Math.PI * 180;
     }*/

    function calcIsoscelesTrianangleAngle(point1, point2, sideLength) {
        let point1X = point1.x,
            point1Y = point1.y,
            point2X = point2.x,
            point2Y = point2.y,
            alpha;

        let distance, deltax, deltay;
        deltax = point2X - point1X;
        deltay = point2Y - point1Y;

        /* Determine the straight-line distance between the top point to dest point. */
        distance = Math.sqrt((deltay * deltay) + (deltax * deltax));

        alpha = Math.acos(1 - (distance * distance) / (2 * sideLength * sideLength));

        return alpha/ Math.PI * 180;
    }

    function calcAngleOfPointFromTop(circle, pointOnCircle) {
        let pointX = pointOnCircle.x,
            pointY = pointOnCircle.y,
            centerX = circle.getX(),
            centerY = circle.getY(),
            radius = circle.getRadius(),
            alpha;

        let distance, deltax, deltay;
        deltax = pointX - (centerX);
        deltay = pointY - (centerY + radius);

        /* Determine the straight-line distance between the top point to dest point. */
        distance = Math.sqrt((deltay * deltay) + (deltax * deltax));

        alpha = Math.acos(1 - (distance * distance) / (2 * radius * radius));

        let topPoint = {x: centerX, y: centerY + radius};

        let angle = calcIsoscelesTrianangleAngle(pointOnCircle, topPoint, radius);

        if (angle !== alpha/ Math.PI * 180) {
            console.log(angle + "alpha: " + alpha)
        }
        return angle
    }


    for (let i = 0; i < circles.length; i++) {
        let color;
        let r = Math.round(Math.random() * 255);
        let g = Math.round(Math.random() * 255);
        let b = Math.round(Math.random() * 255);
        color = "#" + r.toString(16) + g.toString(16) + b.toString(16);

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(circles[i].getX(), circles[i].getY(), circles[i].getRadius(), 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = "20px Arial";
        ctx.fillText(circles[i].getId(), circles[i].getX(), circles[i].getY());

        if (!circles[i].isContained()) {
            for (let j = i + 1; j < circles.length; j++) {
                if (!circles[j].isContained()) {
                    let circle0 = circles[i], circle1 = circles[j];
                    let intersecData = intersection(circle0, circle1);

                    if (typeof intersecData !== "string") {
                        let arcPoints = intersecData.points;
                        let arc_0_angelFromCenter = calcIsoscelesTrianangleAngle(arcPoints[0], arcPoints[1], circle0.getRadius()),
                            arc_0_angelFromTop = calcAngleOfPointFromTop(circle0, arcPoints[0]);
                        let arc_1_angelFromCenter = calcIsoscelesTrianangleAngle(arcPoints[0], arcPoints[1], circle1.getRadius()),
                            arc_1_angelFromTop = calcAngleOfPointFromTop(circle1, arcPoints[0]);

                        if (intersecData.isAngleOverPI) {
                            if (circle0.getRadius() > circle1.getRadius()) {
                                arc_0_angelFromCenter = 360 - arc_0_angelFromCenter;
                            }
                            else {
                                arc_1_angelFromCenter = 360 - arc_1_angelFromCenter;
                            }
                        }

                        let arc_0 = new Arc();
                        arc_0.setPoints(arcPoints);
                        arc_0.setIntersectCircles([circle0, circle1]);
                        arc_0.setAngleFromCenter(arc_0_angelFromCenter);
                        arc_0.setAngleFromTop(arc_0_angelFromTop);
                        circle0.addIntersectPoint(arc_0);

                        let arc_1 = new Arc();
                        arc_1.setPoints(arcPoints);
                        arc_1.setIntersectCircles([circle0, circle1]);
                        arc_1.setAngleFromCenter(arc_1_angelFromCenter);
                        arc_1.setAngleFromTop(arc_1_angelFromTop);
                        circle1.addIntersectPoint(arc_1);

                        //log += arc_0 + arc_1;
                        console.log(arc_0);
                        console.log(arc_1);
                    }
                    else {
                        log += arcPoints;
                    }

                    //log += (circles[i].getIntersectPoints()[0].angleFromTop);
                }
            }
        }
    }

    drawCirclesIntesectPoints(circles);

    document.getElementById("log").value += log;
}

a();
