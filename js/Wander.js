/*
 * Wander by grant on 15-02-11.
 */

(function () {
	"use strict";

	var pi=Math.PI, pi2=pi*2, degToRad=pi/180;

	var Wander = function (props) {
		this.reset(props);
	};
	var p = Wander.prototype;

// private properties:

// public methods:
	p.update = function () {
		if (this.stopped) { return; }
		var x=this.x, y=this.y, r=this.rotation, follow=this.follow, target=this.target, str;
		this.oldX = x;
		this.oldY = y;
		var oldRotation = this.oldRotation = r;
		
		if (this.life != null && !(this.life--)) { this.stopped = true; return; }
		
		// target position:
		var tx= follow ? follow.x : this.targetX, ty = follow ? follow.y : this.targetY;
		if (((str = this.strengthPos) != null || this.radius) && (tx !=null || ty != null)) {
			if (tx == null) { tx = x; }
			if (ty == null) { ty = y; }
			var radius=this.radius, dx=tx-x, dy=ty-y, d=Math.sqrt(dx*dx+dy*dy), a=Math.atan2(dy,dx);
			if (d<this.speed && this.stopAtPos) {
				this.x = x;
				this.y = y;
				this.stopped = true;
				return;
			}
			if (radius > 0) {
				var center = this.center||0;
				var ratio = Math.min(1, (d-center)/(radius-center));
				if (ratio > 0) { str += (1-str)*(ratio*ratio); }
			}
			r += this.getRotationDelta(r, a/degToRad)*str;
			
		}
		
		// random rotation:
		r += Rnd(-this.varyRotation*180, this.varyRotation*180);
		
		// target rotation:
		if ((str = this.strengthRotation) && this.targetRotation != null) {
			r += this.getRotationDelta(r, this.targetRotation) * str;
		}
		
		// limit rotation:
		if ((str = this.limitRotation) != null) {
			var rd = r-oldRotation;
			if (Math.abs(rd) > str) { r = oldRotation+str*(rd<0?-1:1); }
		}
		
		// apply it all:
		var speed = this.speed;
		speed += Rnd(-speed*this.varySpeed, speed*this.varySpeed);
		this.x = x = x+Math.cos(r*degToRad)*speed;
		this.y = y = y+Math.sin(r*degToRad)*speed;
		this.rotation = r;
		
		if (target) {
			target.x = x;
			target.y = y;
			target.rotation = r;
		}
		
	};
	
	p.handleEvent = function(evt) {
		if (evt.type == "tick") { this.update(); }
	};
	
	p.reset = function(props) {
		var t = props&&props.target;
		if (t) {
			this.x = t.x;
			this.y = t.y;
			this.rotation = t.rotation;
		} else { this.x = this.y = this.rotation = 0; }
		
		this.oldX = this.x;
		this.oldY = this.y;
		this.oldRotation = this.rotation;
		
		this.targetX = this.targetY = this.targetRotation = null;
		this.follow = null;
		
		this.radius = this.center = 0;
		this.strengthPos = this.strengthRotation = 0;
		
		this.speed = 0;
		this.varySpeed = this.varyRotation = null;
		this.limitRotation = null;
		
		this.stopped = this.stopAtPos = false;
		this.life = null;
		
		if (props) {
			for (var n in props) {
				this[n] = props[n];
			}
		}
	};

	p.getRotationDelta = function(r1, r2) {
		var r = (r2-r1)%360;
		return r > 180 ? r-=360 : r < -180 ? r+=360 : r;
	};
// private methods:

	window.Wander = Wander;
})();
