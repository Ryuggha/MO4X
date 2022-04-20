using UnityEngine;
using UnityEngine.UI;

public class MainMenuCanvasController : MonoBehaviour
{
    [SerializeField] private GameObject mainButtons;
    [SerializeField] private GameObject gameOnCourseCards;

    public void OnCreateGameClick()
    {
        Debug.Log("Not Implemented Yet");
    }

    public void OnShowCurrentGamesClick()
    {
        mainButtons.SetActive(false);
        gameOnCourseCards.SetActive(true);
    }

    public void OnBackToMainMenuClick()
    {
        mainButtons.SetActive(true);
        gameOnCourseCards.SetActive(false);
    }
}
