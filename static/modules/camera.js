// ============================================================
//  FORENSIC AUTOPSY ASSISTANT – Camera Module
// ============================================================

const Camera = (() => {
    let stream = null;
    let videoEl = null;
    let canvasEl = null;
    let ctx = null;
    let animFrame = null;
    let capturedImg = null;
    let overlayActive = true;

    let pose = null;
    let poseLandmarks = null;
    let isProcessing = false;

    // Y-incision path definition (fallback normalized 0-1 coordinates)
    const Y_LINES = [
        // Left arm of Y: left shoulder → center chest
        { x1: 0.20, y1: 0.15, x2: 0.50, y2: 0.40 },
        // Right arm of Y: right shoulder → center chest
        { x1: 0.80, y1: 0.15, x2: 0.50, y2: 0.40 },
        // Vertical stem: center chest → pubis
        { x1: 0.50, y1: 0.40, x2: 0.50, y2: 0.90 },
    ];

    let dashOffset = 0;

    function init(videoId, canvasId) {
        videoEl = document.getElementById(videoId);
        canvasEl = document.getElementById(canvasId);
        ctx = canvasEl.getContext('2d');

        // Initialize MediaPipe Pose
        if (window.Pose) {
            pose = new window.Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });
            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            pose.onResults((results) => {
                poseLandmarks = results.poseLandmarks;
            });
        }
    }

    async function start() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            videoEl.srcObject = stream;
            videoEl.play();
            videoEl.onloadedmetadata = () => {
                canvasEl.width = videoEl.videoWidth;
                canvasEl.height = videoEl.videoHeight;
                drawLoop();
            };
            return { ok: true };
        } catch (e) {
            return { ok: false, error: 'No se pudo acceder a la cámara: ' + e.message };
        }
    }

    function stop() {
        if (stream) stream.getTracks().forEach(t => t.stop());
        if (animFrame) cancelAnimationFrame(animFrame);
        stream = null;
    }

    function drawLoop() {
        if (!stream) return;
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Draw live video frame
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

        // Send frame to MediaPipe Pose
        if (pose && videoEl.readyState >= 2 && !isProcessing) {
            isProcessing = true;
            pose.send({ image: videoEl }).finally(() => {
                isProcessing = false;
            });
        }

        if (poseLandmarks && window.drawConnectors) {
            // Dibuja en tono leve el esqueleto
            ctx.save();
            ctx.globalAlpha = 0.35;
            window.drawConnectors(ctx, poseLandmarks, window.POSE_CONNECTIONS, { color: '#ffffff', lineWidth: 2 });
            window.drawLandmarks(ctx, poseLandmarks, { color: '#00c8ff', lineWidth: 1, radius: 2 });
            ctx.restore();
        }

        if (overlayActive) {
            if (poseLandmarks) {
                drawDynamicYIncision(poseLandmarks);
            } else {
                drawYIncision(); // Fallback to static if no pose
            }
        }

        dashOffset = (dashOffset + 0.5) % 20;
        animFrame = requestAnimationFrame(drawLoop);
    }

    function drawYIncision() {
        const w = canvasEl.width;
        const h = canvasEl.height;

        ctx.save();

        // Glow shadow
        ctx.shadowColor = '#ff3b5c';
        ctx.shadowBlur = 14;

        ctx.setLineDash([10, 6]);
        ctx.lineDashOffset = -dashOffset;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ff3b5c';
        ctx.lineCap = 'round';

        for (const line of Y_LINES) {
            ctx.beginPath();
            ctx.moveTo(line.x1 * w, line.y1 * h);
            ctx.lineTo(line.x2 * w, line.y2 * h);
            ctx.stroke();
        }

        // Label
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,59,92,0.9)';
        ctx.fillText('✦ Incisión en Y (Estática)', 12, h - 14);

        ctx.restore();
    }

    function drawDynamicYIncision(landmarks) {
        // Landmarks: 11 (Left Shoulder), 12 (Right Shoulder)
        // 23 (Left Hip), 24 (Right Hip)
        const ls = landmarks[11];
        const rs = landmarks[12];
        const lh = landmarks[23];
        const rh = landmarks[24];

        if (!ls || !rs || !lh || !rh) return drawYIncision();

        const midShoulderX = (ls.x + rs.x) / 2;
        const midShoulderY = (ls.y + rs.y) / 2;
        const midHipX = (lh.x + rh.x) / 2;
        const midHipY = (lh.y + rh.y) / 2;

        // Chest point (~30% down from shoulders)
        const chestX = midShoulderX + (midHipX - midShoulderX) * 0.3;
        const chestY = midShoulderY + (midHipY - midShoulderY) * 0.3;

        const w = canvasEl.width;
        const h = canvasEl.height;

        const dynamicLines = [
            { x1: ls.x, y1: ls.y, x2: chestX, y2: chestY },
            { x1: rs.x, y1: rs.y, x2: chestX, y2: chestY },
            { x1: chestX, y1: chestY, x2: midHipX, y2: midHipY },
        ];

        ctx.save();
        ctx.shadowColor = '#00ffaa';
        ctx.shadowBlur = 14;
        ctx.setLineDash([10, 6]);
        ctx.lineDashOffset = -dashOffset;
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#00ffaa'; // Cyan/green for dynamic
        ctx.lineCap = 'round';

        for (const line of dynamicLines) {
            ctx.beginPath();
            ctx.moveTo(line.x1 * w, line.y1 * h);
            ctx.lineTo(line.x2 * w, line.y2 * h);
            ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = 'rgba(0,255,170,0.9)';
        ctx.fillText('✦ Incisión en Y (AI Seguimiento)', 12, h - 14);
        ctx.restore();
    }

    function capture() {
        // Return current canvas content without freezing the live feed
        return canvasEl.toDataURL('image/png');
    }

    function toggleOverlay(show) {
        overlayActive = show;
    }

    return { init, start, stop, capture, toggleOverlay };
})();

window.Camera = Camera;
