function Intro_scene(pixi) {
    let scene = new Container();

    const margin_left = 250;

    let background = new Graphics()
        .beginFill(0x000000)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();

    scene.addChild(background);


    {
        let message = new Text("OUTCEPTION RUN", DARK_STYLE_H1);
        message.position.set(pixi.screen.width/2 - margin_left, 50);
        scene.addChild(message);
    }

    this.points = [];
    this.edges = [];
    this.objects = [];

    {
        this.cube = new Cube(100, scene);
        this.objects.push(this.cube);
        this.cube.points.forEach(point => this.points.push(point));
        this.cube.edges.forEach(edge => this.edges.push(edge));

        this.hypercube = new Hypercube(100, scene);
        this.objects.push(this.hypercube);
        this.hypercube.points.forEach(point => this.points.push(point));
        this.hypercube.edges.forEach(edge => this.edges.push(edge));

        // this.cube2 = new Cube(200, scene);
        // this.objects.push(this.cube2);
        // this.cube2.points.forEach(point => this.points.push(point));
        // this.cube2.edges.forEach(edge => this.edges.push(edge));

        this.cube.x = 1000;
        this.cube.y = 0;
        this.cube.z = 0;
        this.cube.u = 100;
    }

    this.pov = {
        x:0,
        y:0,
        z:-1000,
        u: -1000
    };

    this.pov_s = {
        x:0,
        y:0,
        z:0,
        u:0
    };

    this.view_angle = [0, 0];
    this.view_angle_s = [0, 0];
    this.alpha = 2000;

    scene.update = (delta, now) => {
        let mouse = pixi.renderer.plugins.interaction.mouse.getLocalPosition(scene);

        // this.view_angle[0] += this.view_angle_s[0];
        // this.view_angle[1] += this.view_angle_s[1];

        this.view_angle[0] = mouse.x/1000 - 0.5;
        this.view_angle[1] = mouse.y/1000 - 0.5;

        this.pov.x += this.pov_s.x;
        this.pov.y += this.pov_s.y;
        this.pov.z += this.pov_s.z;
        // this.alpha += this.pov_s.z;

        // this.cube.u += 1;
        // this.cube.y += 0.01;
        // this.cube.z += 2;
        // this.cube.phi += 0.01;
        // this.cube.theta += 0.01;
        // this.cube.sigma_0 += 0.1;

        this.hypercube.phi += 0.01;
        this.hypercube.theta += 0.01;
        this.hypercube.sigma_0 += 0.01;

        // this.cube2.rho += 0.02;

        this.objects.forEach(object => {
            object.update();
        });

        this.points.forEach(point => {
            point.d2 = perspective_projection(point, this.alpha, this.pov, this.view_angle);
            // point.d2 = ortho_projection(point, pov, null);
        });

        this.edges.forEach(edge => {
            edge.update([
                edge.points[0].d2.x + pixi.screen.width/2, edge.points[0].d2.y + pixi.screen.height/2,
                edge.points[1].d2.x + pixi.screen.width/2, edge.points[1].d2.y + pixi.screen.height/2,
            ]);
        });
    };

    const POV_SPEED = 5;

    scene.key_handler = (key, isPress) => {
        if(isPress && key === 39) {
            // this.view_angle_s[0] = 0.05;
            this.pov_s.x = POV_SPEED;
        }
        if(isPress && key === 37) {
            // this.view_angle_s[0] = -0.05;
            this.pov_s.x = -POV_SPEED;
        }
        if(!isPress && (key === 37 || key === 39)) {
            this.pov_s.x = 0;
        }

        if(isPress && key === 38) {
            this.pov_s.z = POV_SPEED;
        }
        if(isPress && key === 40) {
            this.pov_s.z = -POV_SPEED;
        }
        if(!isPress && (key === 38 || key === 40)) {
            this.pov_s.z = 0;
        }
    };

    scene.select = () => {

    };

    return scene;
}