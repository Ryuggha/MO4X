using UnityEngine;

public class CameraControlsStarView : MonoBehaviour
{

    public float screenPanModifier = -0.01f;

    Vector2 lastFramePos;
    bool lastFrameWasPresed;

    private void Update()
    {
        if (InputManager.instance.getTouchscreenPressed())
        {
            if (lastFrameWasPresed)
            {
                move(InputManager.instance.getTouchscreenPos() - lastFramePos);
            }

            // ---

            lastFramePos = InputManager.instance.getTouchscreenPos();
            lastFrameWasPresed = true;
        }
        else
        {
            lastFrameWasPresed = false;
        }
    }

    private void move(Vector2 vec)
    {
        transform.rotation = Quaternion.Euler(0, transform.rotation.eulerAngles.y + (0.01f * Screen.width * vec.x * screenPanModifier), 0);
    }
}
