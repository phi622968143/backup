(function () {

    'use strict';

    /**
     * 相當於1m的px
     */
    var meterPerPixel = 30;
    var RAD_TO_DEG = 180 / Math.PI;

    //取得對應的屬性名稱
    var transformProp = (function () {

        var style = document.createElement('div').style,
            prefix = [
                'transform',
                'webkitTransform',
                'mozTransform',
                'msTransform'
            ];

        for (var i = 0, l = prefix.length; i < l; i++) {
            if (prefix[i] in style) {
                return prefix[i];
            }
        }

        return 'transform';
    }());

    function defaultParam(data, defaults) {
        for (var key in defaults) {
            if (!data[key]) {
                data[key] = defaults[key];
            }
        }
    }

    //匯入為捷徑用
    var b2Vec2          = Box2D.Common.Math.b2Vec2,
        b2BodyDef       = Box2D.Dynamics.b2BodyDef,
        b2Body          = Box2D.Dynamics.b2Body,
        b2FixtureDef    = Box2D.Dynamics.b2FixtureDef,
        b2World         = Box2D.Dynamics.b2World,
        b2PolygonShape  = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape   = Box2D.Collision.Shapes.b2CircleShape;

    /** Rigidbody（剛體）
     * @param {b2World} world 物理引擎世界
     * @param {Object} data 預設引數 */
    function RigidBody(world, data) {

        //設定預設引數
        defaultParam(data, {
            density: 1.0,
            friction: 0.5,
            restitution: 0.2,
            shapeType: RigidBody.shapeType.BOX
        });

        if (data.shapeType === RigidBody.shapeType.CIRCLE) {
            data.width = data.height = data.radius * 2;
            data.radius = (data.radius || 1) / meterPerPixel;
        }

        /*! -------------------------------------------------------
            各種引數的儲存
        ----------------------------------------------------------- */
        this.width  = data.width;
        this.height = data.height;
        this.halfWidth  = data.width * 0.5;
        this.halfHeight = data.height * 0.5;
        this.target = data.target;

        // 產生剛體的「性質」資訊
        var fixDef  = new b2FixtureDef();

        //密度
        fixDef.density = data.density;

        //摩擦係數
        fixDef.friction = data.friction;

        //恢復係數
        fixDef.restitution = data.restitution;

        var halfWidthPerPixel  = this.halfWidth  / meterPerPixel;
        var halfHeightPerPixel = this.halfHeight / meterPerPixel;

        //剛體的形狀
        if (data.shapeType === RigidBody.shapeType.BOX) {
            fixDef.shape = new b2PolygonShape();
            fixDef.shape.SetAsBox(halfWidthPerPixel, halfHeightPerPixel);
        }
        else if (data.shapeType === RigidBody.shapeType.CIRCLE) {
            fixDef.shape = new b2CircleShape();
            fixDef.shape.SetRadius(data.radius);
        }

        // 產生剛體的「狀態」資訊
        var bodyDef = new b2BodyDef();

        //剛體種類
        bodyDef.type = data.type != null ? data.type : b2Body.b2_dynamicBody;

        //剛體位置
        var x = (data.x != null ? data.x : this.halfWidth)  / meterPerPixel;
        var y = (data.y != null ? data.y : this.halfHeight) / meterPerPixel;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        //剛體速度的衰減率設定
        bodyDef.linearDamping = data.linearDamping != null ? data.linearDamping : 0.0;
        bodyDef.angularDamping = data.angularDamping != null ? data.angularDamping : 0.01;

        //若未指定剛體套用元素則產生
        this.el = (data.el != null) ? data.el : document.createElement('div');

        //將剛體的引數設定為DOM的引數
        this.el.className += ' rigidbody';

        if (data.shapeType === RigidBody.shapeType.BOX) {
            this.el.style.width  = this.width  + 'px';
            this.el.style.height = this.height + 'px';
        }
        else if (data.shapeType === RigidBody.shapeType.CIRCLE) {
            this.el.style.height = this.el.style.width = (data.radius * 2 * meterPerPixel) + 'px';
            this.el.style.borderRadius = '50%';
        }

        //已設定target的情況下新增至此
        this.target && this.target.appendChild(this.el);

        //基於設定資訊產生剛體
        this.body = world.CreateBody(bodyDef);

        //在產生出的剛體上套用「性質」
		this.body.CreateFixture(fixDef);
    }
    RigidBody.prototype = {
        constructor: RigidBody,

        /**
         * 將剛體的資訊套用至HTML元素
         */
        applyToDOM: function () {
            var position = this.body.GetPosition();

            //配合meterPerPixel修正位置
            var x = position.x * meterPerPixel - this.halfWidth;
            var y = position.y * meterPerPixel - this.halfHeight;
            var r = this.body.GetAngle() * RAD_TO_DEG;

            x = Math.abs(x) <= 0.0000001 ? 0 : x;
            y = Math.abs(y) <= 0.0000001 ? 0 : y;
            r = Math.abs(r) <= 0.0000001 ? 0 : r;

            this.el.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
        }
    };

    /**
     * Static member
     */
    RigidBody.shapeType = {
        BOX: 'box',
        CIRCLE: 'circle'
    };


    /**
     * 初始化處理
     */
    function init() {

        //剛體管理用陣列
        var rigidBodies = [];
        var target = document.getElementById('contents');

        //靜止狀態下是否進入睡眠
        var allowSleep = true;

        //重力
        var gravity = new b2Vec2(0, 9.8);

        //產生物理運算世界
        var world = new b2World(gravity, allowSleep);

        //產生地面
        var ground = new RigidBody(world, {
            target: target,
            type: b2Body.b2_staticBody,
            width: 1600,
            height: 20,
            x: 10,
            y: 460
        });
        rigidBodies.push(ground);

        //產生左壁
        var leftWall = new RigidBody(world, {
            target: target,
            type: b2Body.b2_staticBody,
            width: 10,
            height: 450,
            x: -5,
            y: 225
        });
        rigidBodies.push(leftWall);

        //產生右壁
        var rightWall = new RigidBody(world, {
            target: target,
            type: b2Body.b2_staticBody,
            width: 10,
            height: 450,
            x: 805,
            y: 225
        });
        rigidBodies.push(rightWall);

        var tagItems = document.querySelectorAll('.tag-cloud__tag-item');
        var cnt = tagItems.length;

        (function loop() {

            cnt--;

            if (cnt < 0) {
                return;
            }

            setTimeout(loop, 240);

            tagItems[cnt].style.display = 'block';
            var bit = new RigidBody(world, {
                el: tagItems[cnt],
                shapeType: RigidBody.shapeType.CIRCLE,
                radius: tagItems[cnt].offsetWidth / 2,
                x: Math.random() * 800,
                y: -80 - Math.random() * 200
            });

            bit.body.SetAngularVelocity(Math.random() * 10);
            rigidBodies.push(bit);
        }());

        //update
        (function update() {

            requestAnimationFrame(update);

            //使物理運算世界的時間前進
            world.Step(
                0.016, //60FPS是16毫秒程度
                10,    //velocityIterations
                10     //positionIterations
            );

            //將計算結果套用至HTML
            for (var i = 0, len = rigidBodies.length; i < len; i++) {
                //rigidBodies為初始化時所定義、用於收納產生出的剛體的陣列。
                rigidBodies[i].applyToDOM();
            }

            // world.DrawDebugData();
            world.ClearForces();

        }());
    }

    window.addEventListener('load', init);
}());
