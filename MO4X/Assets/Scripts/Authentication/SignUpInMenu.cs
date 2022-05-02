using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class SignUpInMenu : MonoBehaviour
{
    public GameObject thisMenu;
    public GameObject signUpMenu;
    public GameObject signInMenu;

    [SerializeField] private Login singIn;
    [SerializeField] private Singin singUp;

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
        try { singIn.clear(); } catch { }
        try { singUp.clear(); } catch { }
        thisMenu.SetActive(true);
        signUpMenu.SetActive(false);
        signInMenu.SetActive(false);
    }
}
