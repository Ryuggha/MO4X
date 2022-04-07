using UnityEngine;

public class SignUpInMenu : MonoBehaviour
{
    public GameObject thisMenu;
    public GameObject signUpMenu;
    public GameObject signInMenu;

    public void OnSignUpClick()
    {
        thisMenu.SetActive(false);
        signUpMenu.SetActive(true);
        signInMenu.SetActive(false);
    }

    public void OnSignInClick()
    {
        thisMenu.SetActive(false);
        signUpMenu.SetActive(false);
        signInMenu.SetActive(true);
    }

    public void OnReturnClick()
    {
        thisMenu.SetActive(true);
        signUpMenu.SetActive(false);
        signInMenu.SetActive(false);
    }
}
