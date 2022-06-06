using UnityEngine;

public class CameraControls : MonoBehaviour
{
    public static CameraControls instance;

    public float screenPanModifier = -0.01f;

    Vector2 firstFramePos;
    Vector2 lastFramePos;
    bool lastFrameWasPresed;

    private void Awake()
    {
        CameraControls.instance = this;
    }

    private void OnDestroy()
    {
        CameraControls.instance = null;
    }

    private void Start()
    {
        firstFramePos = new Vector2(-1, -1);
        StarResponse auxStar = GameController.instance.getActualStar();
        if (auxStar == null || (auxStar != null && auxStar.name == ""))
        {
            print("Pendent of Implementation: Default Starting Position of Camera.");
        }
        else
        {
            transform.position = new Vector3(auxStar.xPos, auxStar.yPos, transform.position.z);
        }
    }

    private void Update()
    {
        if (InputManager.instance.getTouchscreenPressed())
        {
            if (lastFrameWasPresed)
            {
                if (firstFramePos.Equals(new Vector2(-1, -1)))
                {
                    this.firstFramePos = InputManager.instance.getTouchscreenPos();
                }
                move(InputManager.instance.getTouchscreenPos() - lastFramePos);
            }

            // ---

            lastFramePos = InputManager.instance.getTouchscreenPos();
            lastFrameWasPresed = true;
        }
        else
        {
            lastFrameWasPresed = false;
            firstFramePos = new Vector2(-1, -1);
        }
    }

    public float getTotalMovementMagnitude()
    {
        return (firstFramePos - InputManager.instance.getTouchscreenPos()).magnitude;
    }

    private void move(Vector2 vec)
    {
        transform.position += new Vector3(Screen.width * vec.x, Screen.height * vec.y) * screenPanModifier;
    }
}
