using UnityEngine;
using UnityEngine.InputSystem;

public class InputManager : MonoBehaviour
{
    public static InputManager instance;

    private InputActions input;

    private void Awake()
    {
        if (InputManager.instance == null) InputManager.instance = this;
        else
        {
            try { Destroy(gameObject); } catch { } 
        }
        input = new InputActions();
    }

    private void OnEnable()
    {
        input.Enable();
    }

    private void OnDisable()
    {
        try { input.Disable(); } catch { }
    }

    private void Start()
    {
        input.Touch.TouchPress.started += ctx => StartTouch(ctx);
        input.Touch.TouchPress.canceled += ctx => EndTouch(ctx);
    }

    private bool touched;
    private Vector2 a;

    private void StartTouch(InputAction.CallbackContext ctx)
    {
        touched = true;
    }

    private void EndTouch(InputAction.CallbackContext ctx)
    {
        touched = false;
    }

    public bool getTouchscreenPressed ()
    {
        return this.touched;
    }

    private void Update()
    {
        a = getTouchscreenPos();
    }

    public Vector2 getTouchscreenPos ()
    {
        Vector2 aux = input.Touch.TouchPosition.ReadValue<Vector2>();
        return new Vector2(aux.x / Screen.width, aux.y / Screen.height);
    }
}
