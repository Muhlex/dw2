import Vector2 from "./Vector2";

export default class Boid {
	position: Vector2;
	velocity: Vector2;

	color: string;
	size = 25;

	minSpeed = 3;
	maxSpeed = 8;

	avoidRadius = 40;
	avoidFactor = 0.01;

	visionRadius = 100;
	centeringFactor = 0.0005;
	matchingFactor = 0.04;

	edgeMargin = 200;
	edgeTurnFactor = 0.12;

	debug = {
		avoidanceDelta: new Vector2(),
		centeringDelta: new Vector2(),
		matchingDelta: new Vector2(),
	};

	constructor(x = 0, y = 0, config?: Partial<Boid>) {
		this.position = new Vector2(x, y);
		this.velocity = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
		this.color = `hsl(${Math.random()}turn 100% 70%)`;

		Object.assign(this, config);
	}
}
