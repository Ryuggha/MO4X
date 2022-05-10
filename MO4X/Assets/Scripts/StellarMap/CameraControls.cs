using UnityEngine;

public class CameraControls : MonoBehaviour
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
        transform.position += new Vector3(Screen.width * vec.x, Screen.height * vec.y) * screenPanModifier;
    }
}
