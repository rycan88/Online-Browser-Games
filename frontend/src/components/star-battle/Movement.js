
const playerBaseSpeed = 600;
let playerMovementSpeed = playerBaseSpeed;
const maxSpeed = 600;
const maxFallSpeed = 1200;
const acceleration = 1000;
const deceleration = 800;
const jumpVelocity = 450;
export function movePlayerManager(cursorKeys, player, deltaTime) {
    player.setDragX(1200);
    if (cursorKeys.left.isDown || cursorKeys.aKey.isDown) {
        player.setAccelerationX(-acceleration);
    } else if (cursorKeys.right.isDown || cursorKeys.dKey.isDown) {
        player.setAccelerationX(acceleration);
    } else {
        player.setAccelerationX(0);
        if (player.body.velocity.x > 0) {
            player.setVelocityX(Math.max(player.body.velocity.x - deceleration * deltaTime, 0));
        } else if (player.body.velocity.x < 0) {
            player.setVelocityX(Math.min(player.body.velocity.x + deceleration * deltaTime, 0));
        }
    }

    if (cursorKeys.down.isDown || cursorKeys.sKey.isDown) {
    player.setVelocityY(playerMovementSpeed);
    }

    if ((cursorKeys.space.isDown || cursorKeys.up.isDown || cursorKeys.wKey.isDown) && player.body.onFloor()) {
    player.setVelocityY(-jumpVelocity);
    }

    if (cursorKeys.shift.isDown) {
    playerMovementSpeed = playerBaseSpeed * 1.5;
    } else {
    playerMovementSpeed = playerBaseSpeed;
    }
    player.setMaxVelocity(maxSpeed, maxFallSpeed);
    
}