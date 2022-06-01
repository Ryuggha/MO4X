using UnityEngine;
using UnityEngine.EventSystems;

public class StarCollider : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    private float timeToLongPress = 0.25f;
    private bool accessibleStar;
    private StarResponse star;
    private float timePressed = 0;
    private bool screenPressed;


    private void Update()
    {
        if (screenPressed) timePressed += Time.deltaTime;
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        screenPressed = true;
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        screenPressed = false;
        if (timePressed < timeToLongPress)
        {
            enterStarView();
        }
        timePressed = 0;
    }

    private void enterStarView()
    {
        if (accessibleStar)
        {
            GameController.instance.setStar(star);
            SceneController.instance.changeScene("SystemView");
        }
        else
        {
            print("This star is too far from your influence: You can't see it very clearly.");
        }
    } 

    public void setStar(StarResponse star, bool accessibleStar)
    {
        this.accessibleStar = accessibleStar;
        this.star = star;
    }
}
